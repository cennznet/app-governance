import chalk from "chalk";
import { getLogger } from "@gov-libs/utils/getLogger";
import { getRabbitMQSet } from "@gov-libs/utils/getRabbitMQSet";
import { AMQPError, AMQPMessage } from "@cloudamqp/amqp-client";
import { CENNZ_NETWORK, MESSAGE_MAX_TIME } from "@gov-libs/constants";
import { getDiscordWebhook } from "@gov-libs/utils/getDiscordWebhook";
import { handleProposalVotesMessage } from "@proposal-relayer/libs/utils/handleProposalVotesMessage";
import { handleProposalStatusMessage } from "@proposal-relayer/libs/utils/handleProposalStatusMessage";

const logger = getLogger("DeliberationProcessor");
logger.info(
	`Start DeliberationProcessor for CENNZnet ${chalk.magenta("%s")}...`,
	CENNZ_NETWORK
);

Promise.all([getDiscordWebhook()])
	.then(async ([discordWebhook]) => {
		const [channel, queue] = await getRabbitMQSet("DeliberationQueue");

		const onMessage = async (message: AMQPMessage) => {
			const body = message.bodyString();
			if (!body) return;

			const bodyJson = JSON.parse(body);
			const { proposal } = bodyJson;

			if (message.properties.type === "votes")
				await handleProposalVotesMessage(
					discordWebhook,
					queue,
					message,
					proposal,
					bodyJson.votes,
					(AbortSignal as any).timeout(MESSAGE_MAX_TIME)
				);

			if (message.properties.type === "status")
				await handleProposalStatusMessage(
					discordWebhook,
					queue,
					message,
					proposal,
					bodyJson.proposalStatus,
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
