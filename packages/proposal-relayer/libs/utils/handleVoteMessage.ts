import type { ProposalRecordUpdater } from "@proposal-relayer/libs/types";
import type { Api } from "@cennznet/api";
import type { InteractionWebhook } from "discord.js";
import type { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";

import { getLogger } from "@gov-libs/utils/getLogger";
import { createProposalRecordUpdater } from "@proposal-relayer/libs/utils/createProposalRecordUpdater";
import { DiscordHandler } from "@proposal-relayer/libs/utils/DiscordHandler";
import { requeueMessage } from "@gov-libs/utils/requeueMessage";
import { Proposal } from "@proposal-relayer/libs/models";

const logger = getLogger("VoteProcessor");

export async function handleVoteMessage(
	cennzApi: Api,
	discordWebhook: InteractionWebhook,
	discordHandlers: Record<number, DiscordHandler>,
	queue: AMQPQueue,
	message: AMQPMessage,
	abortSignal: AbortSignal
): Promise<string | void> {
	let messageDelivered = false;
	const proposalId = message.bodyString();
	if (!proposalId) return;

	const updateProposalRecord: ProposalRecordUpdater =
		createProposalRecordUpdater(Number(proposalId));

	try {
		abortSignal.addEventListener(
			"abort",
			async () => {
				if (messageDelivered) return;
				await updateProposalRecord?.({ status: "Aborted" });
				await message.reject(false);
				logger.info("Proposal #%s: aborted.", proposalId);
			},
			{ once: true }
		);

		//1. Fetch proposal from MongoDB
		if (abortSignal.aborted) return;
		const proposal = await Proposal.findOne({ proposalId });

		const { state, proposalInfo, proposalDetails } = proposal;

		//2. Send message to Discord if it hasn't
		if (abortSignal.aborted) return;
		if (state !== "DiscordSent") {
			logger.info("Proposal #%s: Sending proposal to Discord...", proposalId);
			discordHandlers[proposalId] = new DiscordHandler(
				cennzApi,
				discordWebhook,
				proposalId,
				proposalDetails,
				proposalInfo
			);
			await discordHandlers[proposalId].sendProposal();

			messageDelivered = true;
			return message.ack();
		}

		//2.5 Update votes on Discord
		logger.info("Proposal #%s: Updating votes...", proposalId);
		await discordHandlers[proposalId].updateVotes();

		messageDelivered = true;
		message.ack();
	} catch (error) {
		messageDelivered = true;
		const response = await requeueMessage(queue, message);
		logger.info("Proposal #%s: %s.", proposalId, response.toLowerCase());
		logger.error("Proposal #%s: %s", proposalId, error);
	}
}
