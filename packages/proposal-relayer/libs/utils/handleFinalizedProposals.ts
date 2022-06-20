import type { AMQPQueue } from "@cloudamqp/amqp-client";
import type { ProposalInterface } from "@proposal-relayer/libs/types";

import { Proposal } from "@proposal-relayer/libs/models";
import { getLogger } from "@gov-libs/utils/getLogger";

const logger = getLogger("VoteListener");

export function handleFinalizedProposals(queue: AMQPQueue): void {
	Proposal.find({})
		.then((proposals: ProposalInterface[]) =>
			proposals?.filter(
				(proposal) =>
					proposal?.proposalDetails &&
					proposal?.proposalInfo &&
					proposal.state !== "Done"
			)
		)
		.then((finalizedProposals) =>
			finalizedProposals?.forEach(({ proposalId }) => {
				logger.info(
					"ProposalVote #%d: Voting finished, sent to queue...",
					proposalId
				);
				queue.publish(String(proposalId));
			})
		);
}
