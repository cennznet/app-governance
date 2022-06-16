import type {
	DiscordMessage,
	ProposalDetails,
	ProposalInfo,
} from "@proposal-relayer/libs/types";

import { MessageEmbed, MessageButton, MessageActionRow } from "discord.js";

export function getDiscordMessage(
	proposalId: number,
	proposalDetails: ProposalDetails,
	proposalInfo: ProposalInfo
): DiscordMessage {
	const embed = new MessageEmbed()
		.setColor("#9847FF")
		.setTitle("New Proposal")
		.setDescription(`**ID:** _#${proposalId}_`)
		.addFields([
			{
				name: "Title",
				value: proposalDetails.title,
				inline: true,
			},
			{
				name: "Details",
				value: proposalDetails.description,
				inline: true,
			},
			{
				name: "Sponsor",
				value: proposalInfo.sponsor,
				inline: false,
			},
			{
				name: "Enactment Delay",
				value: `_${proposalInfo.enactmentDelay} blocks_`,
				inline: false,
			},
		])
		.setTimestamp();

	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setURL("https://saucet.vercel.app")
			.setLabel("Vote!")
			.setStyle("LINK")
	);

	return { embeds: [embed], components: [row] };
}
