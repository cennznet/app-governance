import type {
	DiscordMessage,
	ProposalInterface,
	ProposalRecordUpdater,
	ProposalVotes,
} from "@proposal-relayer/libs/types";
import type { InteractionWebhook } from "discord.js";
import type { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";

import { getLogger } from "@gov-libs/utils/getLogger";
import { createProposalRecordUpdater } from "@proposal-relayer/libs/utils/createProposalRecordUpdater";
import { requeueMessage } from "@gov-libs/utils/requeueMessage";
import { getDiscordMessage } from "./getDiscordMessage";

const logger = getLogger("VoteProcessor");

export async function handleProposalVotesMessage(
	discordWebhook: InteractionWebhook,
	queue: AMQPQueue,
	message: AMQPMessage,
	proposal: ProposalInterface,
	votes: ProposalVotes,
	abortSignal: AbortSignal
): Promise<void> {
	let messageDelivered = false;

	const { proposalId, proposalDetails, proposalInfo } = proposal;
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

		if (abortSignal.aborted) return;
		let discordMessage: DiscordMessage;

		// Create & send Discord message
		if (proposal.state !== "DiscordSent") {
			logger.info("Proposal #%s: Sending proposal to Discord...", proposalId);

			discordMessage = getDiscordMessage(
				proposalId,
				"Deliberation",
				proposalDetails,
				proposalInfo,
				votes
			);

			const { id: discordMessageId } = await discordWebhook.send(
				discordMessage
			);

			await updateProposalRecord({
				discordMessageId,
				state: "DiscordSent",
				status: "Deliberation",
				passVotes: 1,
				rejectVotes: 0,
			});
		}

		// Update Discord message with new votes
		if (proposal.state === "DiscordSent") {
			logger.info("Proposal #%s: Updating votes...", proposalId);

			const { discordMessageId } = proposal;

			discordMessage = getDiscordMessage(
				proposalId,
				"Deliberation",
				proposalDetails,
				proposalInfo,
				votes
			);

			await discordWebhook.editMessage(discordMessageId, discordMessage);

			await updateProposalRecord({
				state: "DiscordSent",
				status: "Deliberation",
				passVotes: votes.passVotes,
				rejectVotes: votes.rejectVotes,
			});
		}

		messageDelivered = true;
		message.ack();
	} catch (error) {
		messageDelivered = true;
		const response = await requeueMessage(queue, message);
		logger.info("ProposalVotes #%d: %s.", proposalId, response.toLowerCase());
		logger.error("ProposalVotes #%d: %s", proposalId, error);
	}
}
