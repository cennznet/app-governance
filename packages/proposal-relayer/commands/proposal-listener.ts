import type { u64 } from "@cennznet/types";

import chalk from "chalk";
import { AMQPError } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK } from "@gov-libs/constants";
import { getLogger } from "@gov-libs/utils/getLogger";
import { Proposal } from "@proposal-relayer/libs/models";
import { waitForBlock } from "@gov-libs/utils/waitForBlock";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { BLOCK_POLLING_INTERVAL } from "@proposal-relayer/libs/constants";
import { getVotesFromBits } from "@proposal-relayer/libs/utils/fetchVotes";
import { handleFinalizedProposals } from "@proposal-relayer/libs/utils/handleFinalizedProposals";
import { collectPendingProposalIds } from "@proposal-relayer/libs/utils/collectPendingProposalIds";

const logger = getLogger("ProposalListener");
logger.info(
	`Start ProposalListener for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getCENNZnetApi()]).then(async ([cennzApi]) => {
	const polling = true;

	const [, proposalQueue] = await getRabbitMQSet("ProposalQueue");
	const [, voteQueue] = await getRabbitMQSet("VoteQueue");

	try {
		//1. Fetch proposals and update DB
		await cennzApi.query.governance.nextProposalId(
			async (nextProposalId: u64) => {
				const proposalIds = await collectPendingProposalIds(
					nextProposalId.toNumber()
				);

				proposalIds.forEach((proposalId) => {
					logger.info("Proposal #%d: Sent to queue...", proposalId);
					proposalQueue.publish(proposalId.toString());
				});
			}
		);

		while (polling) {
			await waitForBlock(cennzApi, BLOCK_POLLING_INTERVAL);

			//2. Fetch votes and update DB & Discord
			await cennzApi.query.governance.proposalVotes.entries((entries: any) => {
				entries.forEach(async ([storageKey, { activeBits, voteBits }]) => {
					const proposalId = storageKey.toHuman()[0];

					const proposal = await Proposal.findOne({
						proposalId: Number(proposalId),
					});
					if (!proposal?.proposalDetails || !proposal?.proposalInfo) return;

					const { passVotes, rejectVotes } = getVotesFromBits(
						activeBits,
						voteBits
					);
					const { passVotes: prevPass, rejectVotes: prevReject } = proposal;
					if (prevPass === passVotes && prevReject === rejectVotes) return;

					logger.info("ProposalVote #%s: Sent to queue...", proposalId);
					voteQueue.publish(proposalId);
				});
			});

			//3. Fetch finalized proposals and update DB & Discord
			await handleFinalizedProposals(voteQueue);
		}
	} catch (error) {
		if (error instanceof AMQPError) error?.connection?.close();
		logger.error("%s", error);
		process.exit(1);
	}
});
