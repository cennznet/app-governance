import type { Api } from "@cennznet/api";
import type { InteractionWebhook } from "discord.js";
import type { ProposalRecordUpdater } from "@proposal-relayer/libs/types";

import { getLogger } from "@gov-libs/utils/getLogger";
import { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";
import { requeueMessage } from "@proposal-relayer/libs/utils/requeueMessage";
import { fetchProposalInfo } from "@proposal-relayer/libs/utils/fetchProposalInfo";
import { fetchProposalDetails } from "@proposal-relayer/libs/utils/fetchProposalDetails";
import { createProposalRecordUpdater } from "@proposal-relayer/libs/utils/createProposalRecordUpdater";
import { DiscordHandler } from "@proposal-relayer/libs/utils/DiscordHandler";

const logger = getLogger("ProposalProcessor");

export async function handleProposalMessage(
	cennzApi: Api,
	discordWebhook: InteractionWebhook,
	queue: AMQPQueue,
	message: AMQPMessage,
	abortSignal: AbortSignal
) {
	const body = message.bodyString();
	if (!body) return;
	const proposalId = Number(body);
	let messageDelivered = false;
	const updateProposalRecord: ProposalRecordUpdater =
		createProposalRecordUpdater(proposalId);

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

		//1. Fetch proposal info from CENNZnet
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

		//2. Fetch proposal details from IPFS
		if (abortSignal.aborted) return;
		logger.info("Proposal #%d: [2/3] fetching details...", proposalId);

		const proposalDetails = await fetchProposalDetails(
			proposalInfo.justificationUri
		);

		await updateProposalRecord({
			proposalDetails,
			state: "DetailsFetched",
		});

		//3. Send proposal to Discord
		if (abortSignal.aborted) return;
		logger.info("Proposal #%d: [3/3] sending proposal...", proposalId);

		const discordHandler = new DiscordHandler(
			cennzApi,
			discordWebhook,
			proposalId,
			proposalDetails,
			proposalInfo
		);

		await discordHandler.sendProposal();
		await updateProposalRecord({
			state: "DiscordSent",
			status: "Deliberation",
		});

		//4. Update proposal status on vote
		await discordHandler.updateOnVote(updateProposalRecord);

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
