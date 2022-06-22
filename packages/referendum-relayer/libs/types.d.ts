import { createReferendumRecordUpdater } from "@referendum-relayer/libs/utils/createReferendumRecordUpdater";

export interface ReferendumInterface {
	proposalId: number;
	vetoSum: number;
	state: "Created" | "Updated" | "DiscordSent" | "Done";
	status: "Pending" | "Failed" | "Skipped" | "Aborted";
}

export type ReferendumRecordUpdater = ReturnType<
	typeof createReferendumRecordUpdater
>;
