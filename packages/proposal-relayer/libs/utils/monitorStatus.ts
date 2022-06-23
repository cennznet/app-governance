import type { Api } from "@cennznet/api";
import type { AMQPQueue } from "@cloudamqp/amqp-client";
import type { ProposalStatusInfo, StorageKey } from "@cennznet/types";

import { getLogger } from "@gov-libs/utils/getLogger";
import { Proposal } from "@proposal-relayer/libs/models";

const logger = getLogger("ProposalListener");

export async function monitorStatus(
	cennzApi: Api,
	queue: AMQPQueue
): Promise<void> {
	await cennzApi.query.governance.proposalStatus.entries(
		(entries: [storageKey: StorageKey, status: ProposalStatusInfo][]) => {
			entries.forEach(async ([storageKey, status]) => {
				const proposalId = storageKey.toHuman()[0];
				const proposalStatus = status.toHuman();

				if (proposalStatus === "Deliberation") return;

				const proposal = await Proposal.findOne({
					proposalId: Number(proposalId),
				});
				if (!proposal?.discordMessageId || proposal?.state === "Done") return;

				logger.info(
					"Proposal #%s: Voting finished, sent to queue...",
					proposalId
				);
				queue.publish(JSON.stringify({ proposal, proposalStatus }), {
					type: "status",
				});
			});
		}
	);
}
