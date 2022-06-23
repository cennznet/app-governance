import type { EmbedFieldData } from "discord.js";
import type { ProposalVotes, VoteAction } from "@proposal-relayer/libs/types";

import { PROPOSALS_URL } from "@proposal-relayer/libs/constants";
import { MessageActionRow, MessageButton } from "discord.js";

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
