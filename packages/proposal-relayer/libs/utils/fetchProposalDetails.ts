import type { ProposalDetails } from "@proposal-relayer/libs/types";

export async function fetchProposalDetails(
	justificationUri: string
): Promise<ProposalDetails> {
	return fetch(justificationUri)
		.then((res) => res.json())
		.then((data) => data);
}
