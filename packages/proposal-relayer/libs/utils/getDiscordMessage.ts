import type {
	ProposalDetails,
	ProposalInfo,
} from "@proposal-relayer/libs/types";

import { MessageEmbed, EmbedFieldData } from "discord.js";

export function getDiscordMessage(
	proposalId: number,
	proposalDetails: ProposalDetails,
	proposalInfo: ProposalInfo
): MessageEmbed {
	return new MessageEmbed()
		.setColor("#1130FF")
		.setTitle("**New Proposal Submitted**")
		.setDescription(`Id: #${proposalId}`)
		.addFields([
			{
				name: "Title",
				value: proposalDetails.title,
			},
			{
				name: "Description",
				value: proposalDetails.description,
				inline: true,
			},
			{
				name: "Sponsor",
				value: proposalInfo.sponsor,
				inline: true,
			},
			{
				name: "Enactment Delay",
				value: `${proposalInfo.enactmentDelay} blocks`,
				inline: true,
			},
		] as EmbedFieldData[])
		.setTimestamp();
}
