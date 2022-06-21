import type { EmbedFieldData } from "discord.js";
import type {
	ProposalDetails,
	ProposalInfo,
	ProposalVotes,
	ProposalStatus,
	VoteAction,
} from "@proposal-relayer/libs/types";

import { PROPOSALS_URL } from "@proposal-relayer/libs/constants";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

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

export function getVoteFields({
	passVotes,
	rejectVotes,
}: ProposalVotes): EmbedFieldData[] {
	return [
		{
			name: "Votes to Pass",
			value: `_**${passVotes}**_`,
			inline: true,
		},
		{
			name: "Votes to Reject",
			value: `_**${rejectVotes}**_`,
			inline: true,
		},
	];
}

export function getVoteButtons(proposalId: number): MessageActionRow {
	return new MessageActionRow().addComponents(
		new MessageButton()
			.setURL(getProposalLink(proposalId, "pass"))
			.setLabel("Pass")
			.setStyle("LINK"),
		new MessageButton()
			.setURL(getProposalLink(proposalId, "reject"))
			.setLabel("Reject")
			.setStyle("LINK")
	);
}

function getProposalLink(proposalId: number, action: VoteAction): string {
	return `${PROPOSALS_URL}/${proposalId}?stage=proposal&action=${action}`;
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
