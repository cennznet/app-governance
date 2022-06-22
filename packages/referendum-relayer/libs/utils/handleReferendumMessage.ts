import type { AMQPQueue, AMQPMessage } from "@cloudamqp/amqp-client";
import type { ReferendumRecordUpdater } from "@referendum-relayer/libs/types";

import { getLogger } from "@gov-libs/utils/getLogger";
import { requeueMessage } from "@gov-libs/utils/requeueMessage";
import { createReferendumRecordUpdater } from "@referendum-relayer/libs/utils/createReferendumRecordUpdater";

const logger = getLogger("ReferendumProcessor");

export async function handleReferendumMessage(
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

		messageDelivered = true;
		await message.ack();
	} catch (error) {
		const response = await requeueMessage(queue, message);
		logger.info("Referendum #%d: %s.", proposalId, response.toLowerCase());
		logger.error("Referendum #%d: %s", proposalId, error);
	}
}
