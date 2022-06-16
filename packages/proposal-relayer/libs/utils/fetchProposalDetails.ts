interface ProposalDetails {
	title: string;
	description: string;
}

export async function fetchProposalDetails(
	justificationUri: string
): Promise<ProposalDetails> {
	return fetch(justificationUri)
		.then((res) => res.json())
		.then((data) => data);
}
