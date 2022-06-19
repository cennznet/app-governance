import type { Api } from "@cennznet/api";
import type { ProposalVoteInfo, u128 } from "@cennznet/types";
import type { ProposalVotes } from "@proposal-relayer/libs/types";

export async function fetchVotes(
	cennzApi: Api,
	proposalId: number | string
): Promise<ProposalVotes> {
	const { activeBits, voteBits } =
		(await cennzApi.query.governance.proposalVotes(
			proposalId
		)) as ProposalVoteInfo;

	return getVotesFromBits(activeBits, voteBits);
}

export function getVotesFromBits(
	activeBits: u128[],
	voteBits: u128[]
): ProposalVotes {
	const activeCount = countOnes(activeBits);
	const passCount = countOnes(voteBits);

	return {
		passVotes: passCount,
		rejectVotes: activeCount - passCount,
	};
}

// This function converts the bits to decimals and counts the number of ones -
// votes are stored in this way for efficiency
function countOnes(bits: u128[]) {
	return bits
		?.map((bit) => (bit.toNumber() >>> 0).toString(2).split("1").length - 1)
		.reduce((total, acc) => total + acc, 0);
}
