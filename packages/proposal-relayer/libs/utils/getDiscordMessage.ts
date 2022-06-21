import type {
	DiscordMessage,
	ProposalDetails,
	ProposalInfo,
	ProposalStatus,
	ProposalVotes,
} from "@proposal-relayer/libs/types";

import {
	getProposalFields,
	getVoteFields,
	getVoteButtons,
	getProposalEmbed,
} from "@proposal-relayer/libs/utils/getDiscordFields";

export function getDiscordMessage(
	proposalId: number,
	proposalStatus: ProposalStatus,
	proposalDetails: ProposalDetails,
	proposalInfo: ProposalInfo,
	votes: ProposalVotes | undefined
): DiscordMessage {
	const proposalFields = getProposalFields(proposalDetails, proposalInfo);

	return {
		components:
			proposalStatus === "Deliberation" ? [getVoteButtons(proposalId)] : [],
		embeds: [
			getProposalEmbed(
				proposalId,
				proposalStatus,
				proposalDetails.title,
				proposalFields,
				proposalStatus === "Deliberation" ? getVoteFields(votes) : undefined
			),
		],
	};
}
