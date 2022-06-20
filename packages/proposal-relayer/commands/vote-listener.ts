import chalk from "chalk";
import { CENNZ_NETWORK } from "@gov-libs/constants";
import { getLogger } from "@gov-libs/utils/getLogger";
import { waitForBlock } from "@gov-libs/utils/waitForBlock";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { BLOCK_POLLING_INTERVAL } from "@proposal-relayer/libs/constants";
import { getVotesFromBits } from "@proposal-relayer/libs/utils/fetchVotes";
import { handleFinalizedProposals } from "@proposal-relayer/libs/utils/handleFinalizedProposals";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { Proposal } from "@proposal-relayer/libs/models";

const logger = getLogger("VoteListener");
logger.info(
	`Start VoteListener for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getCENNZnetApi()]).then(async ([cennzApi]) => {
	const polling = true;

	const [, queue] = await getRabbitMQSet("VoteQueue");

	while (polling) {
		try {
			await cennzApi.query.governance.proposalVotes.entries((entries: any) => {
				entries
					//Sort entries by proposalId
					.sort(([aKey], [bKey]) =>
						Number(aKey.toHuman()[0]) < Number(bKey.toHuman()[0]) ? -1 : 1
					)
					.forEach(async ([storageKey, { activeBits, voteBits }]) => {
						const proposalId = storageKey.toHuman()[0];
						const { passVotes, rejectVotes } = getVotesFromBits(
							activeBits,
							voteBits
						);

						const proposal = await Proposal.findOne({
							proposalId: Number(proposalId),
						});
						if (!proposal?.proposalDetails || !proposal?.proposalInfo) return;

						const { passVotes: prevPass, rejectVotes: prevReject } = proposal;
						if (prevPass === passVotes && prevReject === rejectVotes) return;

						logger.info("ProposalVote #%d: Sent to queue...", proposalId);
						queue.publish(proposalId);
					});
			});

			await handleFinalizedProposals(queue);

			await waitForBlock(cennzApi, BLOCK_POLLING_INTERVAL);
		} catch (error) {
			logger.error("Error: %s", error);
			process.exit();
		}
	}
});
