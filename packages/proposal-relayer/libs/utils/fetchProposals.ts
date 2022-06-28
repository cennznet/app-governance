import type { Api } from "@cennznet/api";
import type { u64 } from "@cennznet/types";
import type { AMQPQueue } from "@cloudamqp/amqp-client";

import { AMQPError } from "@cloudamqp/amqp-client";
import { getLogger } from "@gov-libs/utils/getLogger";
import { collectPendingProposalIds } from "@proposal-relayer/libs/utils/collectPendingProposalIds";

const logger = getLogger("ProposalListener");

export function fetchProposals(cennzApi: Api, queue: AMQPQueue): void {
	cennzApi.query.governance
		.nextProposalId(async (nextProposalId: u64) => {
			const proposalIds = await collectPendingProposalIds(
				nextProposalId.toNumber()
			);

			proposalIds.forEach((proposalId) => {
				logger.info("Proposal #%d: Sent to queue...", proposalId);
				queue.publish(proposalId.toString());
			});
		})
		.catch((error) => {
			if (error instanceof AMQPError) error?.connection?.close();
			logger.error("%s", error);
			process.exit(1);
		});
}
