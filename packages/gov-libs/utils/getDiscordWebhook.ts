import type { InteractionWebhook } from "discord.js";

import { Client } from "discord.js";
import { DISCORD_BOT } from "@gov-libs/lib/constants";

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

export async function getDiscordWebhook(): Promise<InteractionWebhook> {
	const channel: any = bot.channels.cache.get(DISCORD_BOT.ChannelId);

	if (DISCORD_BOT.WebhookId) 
		return channel
			.fetchWebhooks()
			.then((hooks) => hooks.find((hook) => hook.id === DISCORD_BOT.WebhookId));
	

	return await channel.createWebhook(DISCORD_BOT.BotName, {
		avatar: DISCORD_BOT.AvatarUrl,
	});
}
