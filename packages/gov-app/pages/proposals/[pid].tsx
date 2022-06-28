import type { NextPage, NextPageContext } from "next";
import type { ProposalInterface } from "@proposal-relayer/libs/types";

import { Choose } from "react-extras";
import { useEffect, useState } from "react";
import {
	Header,
	Layout,
	ProposalDetailsDisplay,
} from "@gov-app/libs/components";
import { fetchProposal } from "@gov-app/libs/utils/fetchProposal";
import { Spinner } from "@gov-app/libs/assets/vectors";

export const getServerSideProps = (context: NextPageContext) => {
	return {
		props: {
			proposalId: context.query.pid,
		},
	};
};

interface ProposalProps {
	proposalId: string;
}

const Proposal: NextPage<ProposalProps> = ({ proposalId }) => {
	const proposal = useProposal(proposalId);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<h1 className="font-display mb-6 text-center text-6xl uppercase">
					Proposal #{proposalId}
				</h1>
				<Choose>
					<Choose.When condition={!proposal}>
						<Spinner className="m-auto h-8 w-8 animate-spin" />
					</Choose.When>
					<Choose.When condition={!!proposal}>
						<ProposalDetailsDisplay
							proposalDetails={proposal?.proposalDetails}
							proposalInfo={proposal?.proposalInfo}
						/>
					</Choose.When>
				</Choose>
			</div>
		</Layout>
	);
};

export default Proposal;

const useProposal = (proposalId: string): ProposalInterface => {
	const [proposal, setProposal] = useState<ProposalInterface>();

	useEffect(() => {
		if (!proposalId) return;

		fetchProposal(proposalId).then(({ proposal }) => setProposal(proposal));
	}, [proposalId]);

	return proposal;
};
