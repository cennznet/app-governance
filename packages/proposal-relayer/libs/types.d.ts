export interface ProposalDetails {
	title: string;
	description: string;
}

export interface ProposalInfo {
	sponsor: string;
	justificationUri: string;
	enactmentDelay: number;
}

export interface ProposalInterface {
	proposalId: number;
	proposalInfo: ProposalInfo;
	proposalDetails: ProposalDetails;
	state: "Created" | "InfoFetched" | "DetailsFetched" | "DiscordSent";
	status: "Pending" | "Successful" | "Failed" | "Skipped" | "Aborted";
}
