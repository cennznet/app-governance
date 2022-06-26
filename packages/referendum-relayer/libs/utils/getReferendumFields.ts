import type { EmbedFieldData } from "discord.js";
import type {
	ProposalDetails,
	ProposalInfo,
	ProposalStatus,
} from "@proposal-relayer/libs/types";

import { MessageEmbed } from "discord.js";

export function getReferendumFields(
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

export function getReferendumEmbed(
	proposalId: number,
	proposalStatus: ProposalStatus,
	proposalTitle: string,
	referendumFields: EmbedFieldData[],
	vetoFields: EmbedFieldData[] | undefined
): MessageEmbed {
	return proposalStatus === "ReferendumDeliberation"
		? new MessageEmbed()
				.setColor("#9847FF")
				.setTitle(`Referendum ID: _#${proposalId}_`)
				.setDescription(`_**${proposalTitle}**_`)
				.setFields(referendumFields)
				.addFields(vetoFields)
				.setFooter({ text: `Status: ${proposalStatus}` })
				.setTimestamp()
		: new MessageEmbed()
				.setColor(proposalStatus === "Disapproved" ? "RED" : "#05b210")
				.setTitle(`Referendum ID: _#${proposalId}_`)
				.setDescription(`_**${proposalTitle}**_`)
				.setFields(referendumFields)
				.setFooter({ text: `Status: ${proposalStatus}` })
				.setTimestamp();
}
