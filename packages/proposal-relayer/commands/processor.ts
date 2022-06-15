import * as chalk from "chalk";
import { getLogger } from "@gov-libs/utils/getLogger";
import { getCENNZnetApi } from "@gov-libs/utils/getCENNZnetApi";
import { getDiscordWebhook } from "@gov-libs/utils/getDiscordWebhook";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { AMQPError, AMQPMessage } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK, MESSAGE_MAX_TIME } from "@gov-libs/lib/constants";
import { handleProposalMessage } from "@proposal-relayer/libs/utils/handleProposalMessage";

const logger = getLogger("ProposalProcessor");
logger.info(
	`Start ProposalProcessor for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getCENNZnetApi(), getDiscordWebhook()])
	.then(async ([cennzApi, discordWebhook]) => {
		const [channel, queue] = await getRabbitMQSet("ProposalQueue");

		const onMessage = async (message: AMQPMessage) => {
			await handleProposalMessage(
				cennzApi,
				discordWebhook,
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
