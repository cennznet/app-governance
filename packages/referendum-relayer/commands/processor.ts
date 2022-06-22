import chalk from "chalk";
import { getLogger } from "@gov-libs/utils/getLogger";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { AMQPError, AMQPMessage } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK, MESSAGE_MAX_TIME } from "@gov-libs/constants";
import { handleReferendumMessage } from "@referendum-relayer/libs/utils/handleReferendumMessage";
import { getDiscordWebhook } from "@gov-libs/utils/getDiscordWebhook";

const logger = getLogger("ReferendumProcessor");
logger.info(
	`Start ReferendumProcessor for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getDiscordWebhook()])
	.then(async ([discordWebhook]) => {
		const [channel, queue] = await getRabbitMQSet("ReferendumQueue");

		const onMessage = async (message: AMQPMessage) => {
			await handleReferendumMessage(
				discordWebhook,
				queue,
				message,
				message.properties.type,
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
