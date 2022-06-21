import type {
	ProposalInterface,
	ProposalRecordUpdater,
	ProposalStatus,
} from "@proposal-relayer/libs/types";
import type { InteractionWebhook } from "discord.js";
import type { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";

import { createProposalRecordUpdater } from "./createProposalRecordUpdater";
import { requeueMessage } from "@gov-libs/utils/requeueMessage";
import { getDiscordMessage } from "@proposal-relayer/libs/utils/getDiscordMessage";
import { getLogger } from "@gov-libs/utils/getLogger";

const logger = getLogger("VoteProcessor");

export async function handleProposalStatusMessage(
	discordWebhook: InteractionWebhook,
	queue: AMQPQueue,
	message: AMQPMessage,
	proposal: ProposalInterface,
	proposalStatus: ProposalStatus,
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
		const { discordMessageId } = proposal;
		const discordMessage = getDiscordMessage(
			proposalId,
			proposalStatus,
			proposalDetails,
			proposalInfo,
			undefined
		);

		await discordWebhook.editMessage(discordMessageId, discordMessage);

		await updateProposalRecord({
			state: "Done",
			status: proposalStatus,
		});

		messageDelivered = true;
		message.ack();
	} catch (error) {
		messageDelivered = true;
		const response = await requeueMessage(queue, message);
		logger.info("ProposalVotes #%d: %s.", proposalId, response.toLowerCase());
		logger.error("ProposalVotes #%d: %s", proposalId, error);
	}
}
