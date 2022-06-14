import type { Api } from "@cennznet/api";

import { getLogger } from "@gov-libs/utils/getLogger";
import { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";
import { Proposal, ProposalInterface } from "@proposal-relayer/libs/models";
import { requeueMessage } from "@proposal-relayer/libs/utils/requeueMessage";

const logger = getLogger("ProposalProcessor");

export async function handleProposalMessage(
	cennzApi: Api,
	queue: AMQPQueue,
	message: AMQPMessage,
	abortSignal: AbortSignal
) {
	let updateProposalRecord: any = null;
	const body = message.bodyString();
	if (!body) return;
	const proposalId = Number(body);
	let messageDelivered = false;
	updateProposalRecord = createProposalRecordUpdater(proposalId) as ReturnType<
		typeof createProposalRecordUpdater
	>;

	try {
		abortSignal.addEventListener(
			"abort",
			async () => {
				if (messageDelivered) return;
				await updateProposalRecord?.({ status: "Aborted" });
				await message.reject(false);
				logger.info("Request #%d: aborted.", proposalId);
			},
			{ once: true }
		);

	} catch (error: any) {
		messageDelivered = true;
		const response = await requeueMessage(queue, message);
		logger.info("Proposal #%d: %s.", proposalId, response.toLowerCase());
		logger.error("Proposal #%d: %s", proposalId, error);
	}
}

function createProposalRecordUpdater(
	proposalId: number
): (data: Partial<ProposalInterface>) => Promise<any> {
	return async (data: Partial<ProposalInterface>) =>
		Proposal.findOneAndUpdate(
			{ proposalId },
			{ ...data, proposalId, updatedAt: new Date() },
			{ upsert: true }
		);
}