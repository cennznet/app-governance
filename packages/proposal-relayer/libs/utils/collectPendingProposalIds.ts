import { Proposal } from "@proposal-relayer/libs/models";

export const collectPendingProposalIds = async (
	nextProposalId: number
): Promise<number[]> => {
	const lastProcessedProposal = await Proposal.findOne()
		.sort({
			proposalId: "desc",
		})
		.exec();

	const proposalIdToStart = lastProcessedProposal
		? lastProcessedProposal.proposalId + 1
		: 0;

	const proposalIds = [];

	for (let i = proposalIdToStart; i < nextProposalId; i++) proposalIds.push(i);

	return proposalIds;
};
