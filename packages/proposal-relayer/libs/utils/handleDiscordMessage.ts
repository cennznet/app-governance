import type { ProposalRecordUpdater } from "@proposal-relayer/libs/types";

import { getLogger } from "@gov-libs/utils/getLogger";
import { createProposalRecordUpdater } from "@proposal-relayer/libs/utils/createProposalRecordUpdater";
import { DiscordHandler } from "@proposal-relayer/libs/utils/DiscordHandler";

const logger = getLogger("ProposalDiscord");

export async function handleDiscordMessage(
	proposalId: number,
	newProposal: boolean,
	discordHandler: DiscordHandler
): Promise<string | void> {
	const updateProposalRecord: ProposalRecordUpdater =
		createProposalRecordUpdater(proposalId);

	//1. Send proposal to discord if new proposal
	if (newProposal) {
		logger.info("Proposal #%d: Sending new proposal...", proposalId);
		await discordHandler.sendProposal();
		await updateProposalRecord({
			state: "DiscordSent",
			status: "Deliberation",
		});
	}

	//2. Update proposal status on vote, return if voting completed
	return await discordHandler.updateOnVote(updateProposalRecord);
}
