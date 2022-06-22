import type { InteractionWebhook } from "discord.js";
import type { DiscordMessage } from "@gov-libs/types";
import type { ProposalStatus } from "@proposal-relayer/libs/types";
import type { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";
import type { ReferendumRecordUpdater } from "@referendum-relayer/libs/types";

import { getLogger } from "@gov-libs/utils/getLogger";
import { Proposal } from "@proposal-relayer/libs/models";
import { requeueMessage } from "@gov-libs/utils/requeueMessage";
import { getDiscordMessage } from "@referendum-relayer/libs/utils/getDiscordMessage";
import { createReferendumRecordUpdater } from "@referendum-relayer/libs/utils/createReferendumRecordUpdater";

const logger = getLogger("ReferendumProcessor");

export async function handleReferendumMessage(
	discordWebhook: InteractionWebhook,
	queue: AMQPQueue,
	message: AMQPMessage,
	messageType: string,
	abortSignal: AbortSignal
) {
	let messageDelivered = false;

	const body = message.bodyString();
	if (!body) return;

	const { proposalId, vetoSum } = JSON.parse(body);
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
		logger.info("Referendum #%d: Updating veto sum...", proposalId);
		updateReferendumRecord({
			vetoSum,
			state: messageType === "new" ? "Created" : "Updated",
			status: "Pending",
		});

		if (abortSignal.aborted) return;
		const proposal = await Proposal.findOne({ proposalId });
		if (!proposal) return;

		const { proposalDetails, proposalInfo, status, state } = proposal;

		logger.info(
			"Referendum #%d: Updating referendum on Discord...",
			proposalId
		);
		let discordMessage: DiscordMessage;
		if (state !== "DiscordSent") {
			discordMessage = getDiscordMessage(
				proposalId,
				status as ProposalStatus,
				proposalDetails,
				proposalInfo,
				vetoSum
			);

			const { id: discordMessageId } = await discordWebhook.send(
				discordMessage
			);

			updateReferendumRecord({
				discordMessageId,
			});
		}

		if (state === "DiscordSent") {
			const { discordMessageId } = proposal;
			if (!discordMessageId) return;

			discordMessage = getDiscordMessage(
				proposalId,
				status as ProposalStatus,
				proposalDetails,
				proposalInfo,
				undefined
			);

			if (status !== "ReferendumDeliberation")
				updateReferendumRecord({
					state: "Done",
				});
		}

		messageDelivered = true;
		await message.ack();
	} catch (error) {
		const response = await requeueMessage(queue, message);
		logger.info("Referendum #%d: %s.", proposalId, response.toLowerCase());
		logger.error("Referendum #%d: %s", proposalId, error);
	}
}
