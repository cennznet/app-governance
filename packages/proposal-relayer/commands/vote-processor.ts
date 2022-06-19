import chalk from "chalk";
import { CENNZ_NETWORK, MESSAGE_MAX_TIME } from "@gov-libs/constants";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { getDiscordWebhook } from "@gov-libs/utils/getDiscordWebhook";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { handleVoteMessage } from "@proposal-relayer/libs/utils/handleVoteMessage";
import { AMQPError, AMQPMessage } from "@cloudamqp/amqp-client";
import { getLogger } from "@gov-libs/utils/getLogger";
import { DiscordHandler } from "@proposal-relayer/libs/utils/DiscordHandler";

const logger = getLogger("VoteProcessor");
logger.info(
	`Start VoteProcessor for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getCENNZnetApi(), getDiscordWebhook()])
	.then(async ([cennzApi, discordWebhook]) => {
		const discordHandlers: Record<number, DiscordHandler> = {};

		const [channel, queue] = await getRabbitMQSet("VoteQueue");

		const onMessage = async (message: AMQPMessage) => {
			await handleVoteMessage(
				cennzApi,
				discordWebhook,
				discordHandlers,
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
