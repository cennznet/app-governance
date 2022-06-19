import type { Api } from "@cennznet/api";
import type { ProposalRecordUpdater } from "@proposal-relayer/libs/types";

import { getLogger } from "@gov-libs/utils/getLogger";
import { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";
import { requeueMessage } from "@gov-libs/utils/requeueMessage";
import { fetchProposalInfo } from "@proposal-relayer/libs/utils/fetchProposalInfo";
import { fetchProposalDetails } from "@proposal-relayer/libs/utils/fetchProposalDetails";
import { createProposalRecordUpdater } from "@proposal-relayer/libs/utils/createProposalRecordUpdater";

const logger = getLogger("ProposalProcessor");

export async function handleProposalMessage(
	cennzApi: Api,
	queue: AMQPQueue,
	message: AMQPMessage,
	abortSignal: AbortSignal
) {
	let messageDelivered = false;

	const body = message.bodyString();
	if (!body) return;
	
	const proposalId = Number(body);
	const updateProposalRecord: ProposalRecordUpdater =
		createProposalRecordUpdater(proposalId);

	try {
		abortSignal.addEventListener(
			"abort",
			async () => {
				if (messageDelivered) return;
				await updateProposalRecord?.({ status: "Aborted" });
				await message.reject(false);
				logger.info("Proposal #%d: aborted.", proposalId);
			},
			{ once: true }
		);

		//1. Fetch proposal info from CENNZnet & store in DB
		if (abortSignal.aborted) return;
		logger.info("Proposal #%d: [1/3] fetching info...", proposalId);

		const proposalInfo = await fetchProposalInfo(cennzApi, proposalId);
		if (!proposalInfo) {
			await updateProposalRecord({
				status: "Skipped",
			});
			messageDelivered = true;
			await message.ack();
			logger.info("Proposal #%d: skipped.", proposalId);
			return;
		}

		await updateProposalRecord({
			proposalInfo,
			state: "InfoFetched",
		});

		//2. Fetch proposal details from IPFS & store in DB
		if (abortSignal.aborted) return;
		logger.info("Proposal #%d: [2/3] fetching details...", proposalId);

		const proposalDetails = await fetchProposalDetails(
			proposalInfo.justificationUri
		);

		await updateProposalRecord({
			proposalDetails,
			state: "DetailsFetched",
			status: "Deliberation",
		});

		if (abortSignal.aborted) return;
		messageDelivered = true;
		await message.ack();
		logger.info("Proposal #%d: done 🎉", proposalId);
	} catch (error: any) {
		messageDelivered = true;
		const response = await requeueMessage(queue, message);
		logger.info("Proposal #%d: %s.", proposalId, response.toLowerCase());
		logger.error("Proposal #%d: %s", proposalId, error);
	}
}
