import type {
	ProposalDetails,
	ProposalInfo,
	ProposalStatus,
} from "@proposal-relayer/libs/types";
import type { DiscordMessage } from "@gov-libs/types";
import type { VetoSumFields } from "@referendum-relayer/libs/types";

import {
	getReferendumFields,
	getReferendumEmbed,
} from "@referendum-relayer/libs/utils/getReferendumFields";
import {
	getVetoButton,
	getVetoSumField,
} from "@referendum-relayer/libs/utils/getVetoFields";

export function getDiscordMessage(
	proposalId: number,
	proposalStatus: ProposalStatus,
	proposalDetails: ProposalDetails,
	proposalInfo: ProposalInfo,
	vetoSumFields: VetoSumFields
): DiscordMessage {
	const referendumFields = getReferendumFields(proposalDetails, proposalInfo);

	return {
		components:
			proposalStatus === "ReferendumDeliberation"
				? [getVetoButton(proposalId)]
				: [],
		embeds: [
			getReferendumEmbed(
				proposalId,
				proposalStatus,
				proposalDetails.title,
				referendumFields,
				proposalStatus === "ReferendumDeliberation"
					? getVetoSumField(vetoSumFields)
					: undefined
			),
		],
	};
}
