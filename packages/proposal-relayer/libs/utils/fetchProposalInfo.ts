import type { Api } from "@cennznet/api";

interface ProposalInfo {
	sponsor: string;
	justificationUri: string;
	enactmentDelay: number;
}

export async function fetchProposalInfo(
	cennzApi: Api,
	proposalId: number
): Promise<ProposalInfo | void> {
	const rawProposalInfo: any = await cennzApi.query.governance.proposals(
		proposalId
	);

	if (rawProposalInfo.isNone) return;

	const proposalInfo = rawProposalInfo.toHuman();

	return {
		...proposalInfo,
		enactmentDelay: Number(proposalInfo.enactmentDelay),
	} as ProposalInfo;
}
