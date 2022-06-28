export const fetchProposal = async (proposalId: string) => {
	const response = await fetch(
		`/api/db/fetchProposal?proposalId=${proposalId}`
	);

	const data = await response.json();

	if (!response.ok)
		throw {
			code: response.status,
			message: data?.message ?? response.statusText,
		};

	return data;
};
