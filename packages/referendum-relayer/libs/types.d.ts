import type { ProposalInterface } from "@proposal-relayer/libs/types";

import { createReferendumRecordUpdater } from "@referendum-relayer/libs/utils/createReferendumRecordUpdater";

export interface ReferendumInterface {
	discordMessageId: string;
	proposalId: number;
	vetoSum: number;
	state: "Created" | "Updated" | "DiscordSent" | "Done";
	status: "Pending" | "Failed" | "Skipped" | "Aborted";
}

export type ReferendumRecordUpdater = ReturnType<
	typeof createReferendumRecordUpdater
>;

export interface ReferendumMessageBody {
	proposalId: number;
	proposal: ProposalInterface;
	referendum?: ReferendumInterface;
	vetoSum: number;
}
