import type { MessageEmbed, MessageActionRow } from "discord.js";

export type LoggerService =
	| "ReferendumListener"
	| "ReferendumProcessor"
	| "ProposalListener"
	| "ProposalProcessor"
	| "DeliberationProcessor"
	| "DiscordBot";

export interface DiscordMessage {
	components: MessageActionRow[];
	embeds: MessageEmbed[];
}
