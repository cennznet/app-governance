import type { InteractionWebhook } from "discord.js";

import { Client } from "discord.js";
import { getLogger } from "@gov-libs/utils/getLogger";
import { waitFor } from "@gov-libs/utils/waitFor";
import { DISCORD_BOT } from "@gov-libs/lib/constants";

const logger = getLogger("DiscordBot");

const bot: Client<true> = new Client({
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
	intents: [
		"DIRECT_MESSAGES",
		"DIRECT_MESSAGE_REACTIONS",
		"GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS",
		"GUILDS",
	],
});

bot.login(DISCORD_BOT.Token);

export async function getDiscordWebhook(): Promise<InteractionWebhook> {
	let webhook: InteractionWebhook;

	bot.on("ready", async () => {
		const channel: any = bot.channels.cache.get(DISCORD_BOT.ChannelId);

		if (DISCORD_BOT.WebhookId)
			webhook = channel
				.fetchWebhooks()
				.then((hooks) =>
					hooks.find((hook) => hook.id === DISCORD_BOT.WebhookId)
				);
		else
			webhook = await channel.createWebhook(DISCORD_BOT.BotName, {
				avatar: DISCORD_BOT.AvatarUrl,
			});
	});

	while (!webhook) {
		logger.info("DiscordBot initializing...");
		await waitFor(5);
	}

	logger.info("DiscordBot ready!");
	return webhook;
}
