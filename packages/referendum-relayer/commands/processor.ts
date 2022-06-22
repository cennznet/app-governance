import chalk from "chalk";
import { getLogger } from "@gov-libs/utils/getLogger";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { AMQPError, AMQPMessage } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK, MESSAGE_MAX_TIME } from "@gov-libs/constants";
import { getDiscordWebhook } from "@gov-libs/utils/getDiscordWebhook";
import { handleReferendumNewMessage } from "@referendum-relayer/libs/utils/handleReferendumNewMessage";
import { handleReferendumUpdateMessage } from "@referendum-relayer/libs/utils/handleReferendumUpdateMessage";

const logger = getLogger("ReferendumProcessor");
logger.info(
	`Start ReferendumProcessor for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getDiscordWebhook()])
	.then(async ([discordWebhook]) => {
		const [channel, queue] = await getRabbitMQSet("ReferendumQueue");

		const onMessage = async (message: AMQPMessage) => {
			const body = message.bodyString();
			if (!body) return;

			if (message.properties.type === "new")
				await handleReferendumNewMessage(
					discordWebhook,
					JSON.parse(body),
					queue,
					message,
					(AbortSignal as any).timeout(MESSAGE_MAX_TIME)
				);

			if (message.properties.type === "update")
				await handleReferendumUpdateMessage(
					discordWebhook,
					JSON.parse(body),
					queue,
					message,
					(AbortSignal as any).timeout(MESSAGE_MAX_TIME)
				);
		};

		channel.prefetch(1);
		queue.subscribe({ noAck: false }, onMessage);
	})
	.catch((error) => {
		if (error instanceof AMQPError) error?.connection?.close();
		logger.error("%s", error);
		process.exit(1);
	});
