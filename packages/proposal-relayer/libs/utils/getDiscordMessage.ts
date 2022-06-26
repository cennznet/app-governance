import type {
	ProposalDetails,
	ProposalInfo,
	ProposalStatus,
	ProposalVotes,
} from "@proposal-relayer/libs/types";
import type { DiscordMessage } from "@gov-libs/types";

import {
	getProposalFields,
	getProposalEmbed,
} from "@proposal-relayer/libs/utils/getProposalFields";
import {
	getVoteFields,
	getVoteButtons,
} from "@proposal-relayer/libs/utils/getVoteFields";

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
