import type { Api } from "@cennznet/api";
import type { AMQPQueue } from "@cloudamqp/amqp-client";
import type { ProposalVoteInfo, StorageKey } from "@cennznet/types";

import { getLogger } from "@gov-libs/utils/getLogger";
import { Proposal } from "@proposal-relayer/libs/models";
import { getVotesFromBits } from "@proposal-relayer/libs/utils/getVotesFromBits";

const logger = getLogger("ProposalListener");

export async function fetchVotes(
	cennzApi: Api,
	queue: AMQPQueue
): Promise<void> {
	await cennzApi.query.governance.proposalVotes.entries(
		(entries: [storageKey: StorageKey, votes: ProposalVoteInfo][]) => {
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

				logger.info("Proposal #%s: New votes, sent to queue...", proposalId);
				queue.publish(
					JSON.stringify({ proposal, votes: { passVotes, rejectVotes } }),
					{ type: "votes" }
				);
			});
		}
	);
}
