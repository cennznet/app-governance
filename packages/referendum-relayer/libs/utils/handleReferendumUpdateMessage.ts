import type { InteractionWebhook } from "discord.js";
import type { ProposalStatus } from "@proposal-relayer/libs/types";
import type { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";
import type { ReferendumDetails, ReferendumRecordUpdater } from "@referendum-relayer/libs/types";

import { getLogger } from "@gov-libs/utils/getLogger";
import { Proposal } from "@proposal-relayer/libs/models";
import { requeueMessage } from "@gov-libs/utils/requeueMessage";
import { getDiscordMessage } from "@referendum-relayer/libs/utils/getDiscordMessage";
import { createReferendumRecordUpdater } from "@referendum-relayer/libs/utils/createReferendumRecordUpdater";

const logger = getLogger("ReferendumProcessor");

export async function handleReferendumUpdateMessage(
	discordWebhook: InteractionWebhook,
	{ proposalId, vetoSum }: ReferendumDetails,
	queue: AMQPQueue,
	message: AMQPMessage,
	abortSignal: AbortSignal
) {
	let messageDelivered = false;
	const updateReferendumRecord: ReferendumRecordUpdater =
		createReferendumRecordUpdater(proposalId);

	try {
		abortSignal.addEventListener(
			"abort",
			async () => {
				if (messageDelivered) return;
				await updateReferendumRecord?.({ status: "Aborted" });
				await message.reject(false);
				logger.info("Referendum #%d: aborted.", proposalId);
			},
			{ once: true }
		);

		if (abortSignal.aborted) return;
		logger.info("Referendum #%d: [1/2] Updating DB...", proposalId);
		await updateReferendumRecord({
			vetoSum,
			state: "Updated",
			status: "Pending",
		});

		if (abortSignal.aborted) return;
		const proposal = await Proposal.findOne({ proposalId });
		if (!proposal) return;

		const { proposalDetails, proposalInfo, status, discordMessageId } =
			proposal;
		if (!discordMessageId) return;

		logger.info(
			"Referendum #%d: [2/2] Updating on Discord...",
			proposalId
		);
		const discordMessage = getDiscordMessage(
			proposalId,
			status as ProposalStatus,
			proposalDetails,
			proposalInfo,
			undefined
		);

		await discordWebhook.editMessage(discordMessageId, discordMessage);

		if (status !== "ReferendumDeliberation")
			await updateReferendumRecord({
				state: "Done",
			});

		messageDelivered = true;
		await message.ack();
		logger.info("Referendum #%d: done 🎉", proposalId);
	} catch (error) {
		const response = await requeueMessage(queue, message);
		logger.info("Referendum #%d: %s.", proposalId, response.toLowerCase());
		logger.error("Referendum #%d: %s", proposalId, error);
	}
}
