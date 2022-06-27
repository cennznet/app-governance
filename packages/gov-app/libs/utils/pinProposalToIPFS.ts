import { PINATA_JWT } from "@gov-app/libs/constants";

interface ProposalData {
	proposalTitle: string;
	proposalDetails: string;
}

export const pinProposalToIPFS = async ({
	proposalTitle,
	proposalDetails,
}: ProposalData) => {
	const data = JSON.stringify({
		pinataOptions: {
			cidVersion: 1,
		},
		pinataContent: {
			title: proposalTitle,
			description: proposalDetails,
		},
		pinataMetadata: {
			name: "proposal",
		},
	});

	const response = await fetch(
		"https://api.pinata.cloud/pinning/pinJSONToIPFS",
		{
			method: "POST",
			headers: {
				"Authorization": `Bearer ${PINATA_JWT}`,
				"Content-Type": "application/json",
			},
			body: data,
		}
	);

	return response.json();
};
