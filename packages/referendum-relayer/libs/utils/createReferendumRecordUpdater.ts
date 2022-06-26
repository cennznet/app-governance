import type { ReferendumInterface } from "@referendum-relayer/libs/types";

import { Referendum } from "@referendum-relayer/libs/models";

export function createReferendumRecordUpdater(
	proposalId: number
): (data: Partial<ReferendumInterface>) => Promise<any> {
	return async (data: Partial<ReferendumInterface>) =>
		Referendum.findOneAndUpdate(
			{ proposalId },
			{ ...data, proposalId },
			{ upsert: true }
		);
}
