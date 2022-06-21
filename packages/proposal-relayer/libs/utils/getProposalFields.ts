import type { EmbedFieldData } from "discord.js";
import type {
	ProposalDetails,
	ProposalInfo,
	ProposalStatus,
} from "@proposal-relayer/libs/types";

import { MessageEmbed } from "discord.js";

export function getProposalFields(
	proposalDetails: ProposalDetails,
	proposalInfo: ProposalInfo
): EmbedFieldData[] {
	return [
		{
			name: "Details",
			value: proposalDetails.description,
		},
		{
			name: "Sponsor",
			value: `_${proposalInfo.sponsor}_`,
		},
		{
			name: "Enactment Delay",
			value: `${proposalInfo.enactmentDelay} blocks`,
		},
	];
}

export function getProposalEmbed(
	proposalId: number,
	proposalStatus: ProposalStatus,
	proposalTitle: string,
	proposalFields: EmbedFieldData[],
	voteFields: EmbedFieldData[] | undefined
): MessageEmbed {
	return proposalStatus === "Deliberation"
		? new MessageEmbed()
				.setColor("#9847FF")
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setDescription(`_**${proposalTitle}**_`)
				.setFields(proposalFields)
				.addFields(voteFields)
				.setFooter({ text: `Status: ${proposalStatus}` })
				.setTimestamp()
		: new MessageEmbed()
				.setColor(proposalStatus === "Disapproved" ? "RED" : "#05b210")
				.setTitle(`Proposal ID: _#${proposalId}_`)
				.setDescription(`_**${proposalTitle}**_`)
				.setFields(proposalFields)
				.setFooter({ text: `Status: ${proposalStatus}` })
				.setTimestamp();
}
