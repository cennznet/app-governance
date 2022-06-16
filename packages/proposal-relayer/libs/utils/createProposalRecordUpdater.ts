import type { ProposalInterface } from "@proposal-relayer/libs/types";

import { Proposal } from "@proposal-relayer/libs/models";

export function createProposalRecordUpdater(
	proposalId: number
): (data: Partial<ProposalInterface>) => Promise<any> {
	return async (data: Partial<ProposalInterface>) =>
		Proposal.findOneAndUpdate(
			{ proposalId },
			{ ...data, proposalId },
			{ upsert: true }
		);
}
