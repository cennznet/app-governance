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

export async function handleReferendumNewMessage(
	discordWebhook: InteractionWebhook,
	{proposalId, vetoSum}: ReferendumDetails,
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
		logger.info("Referendum #%d: [1/2] Adding to DB...", proposalId);
		await updateReferendumRecord({
			vetoSum,
			state: "Created",
			status: "Pending",
		});

		if (abortSignal.aborted) return;
		const proposal = await Proposal.findOne({ proposalId });

		const { proposalDetails, proposalInfo, status } = proposal;

		logger.info("Referendum #%d: [2/2] Sending to Discord...", proposalId);
		const discordMessage = getDiscordMessage(
			proposalId,
			status as ProposalStatus,
			proposalDetails,
			proposalInfo,
			vetoSum
		);

		const { id: discordMessageId } = await discordWebhook.send(discordMessage);

		await updateReferendumRecord({
			discordMessageId,
			state: "DiscordSent"
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
