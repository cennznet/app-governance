import type { NextPage } from "next";
import type { ProposalInterface } from "@proposal-relayer/libs/types";

import { If } from "react-extras";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header, Layout } from "@gov-app/libs/components";
import { fetchProposal } from "@gov-app/libs/utils/fetchProposal";

const Proposal: NextPage = () => {
	const router = useRouter();
	const { pid } = router.query;

	const proposal = useProposal(pid as string);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<h1 className="font-display text-center text-6xl uppercase">
					Proposal #{pid}
				</h1>
				<If condition={!!proposal}>
					<div className="mb-6 space-y-4">
						<span className="border-hero border-b-2 text-2xl">
							{proposal?.proposalDetails?.title}
						</span>
						<p className="text-base">
							{proposal?.proposalDetails?.description}
						</p>
					</div>
					<div className="space-y-4">
						<div>
							<span className="italic">Sponsor</span>
							<p>{proposal?.proposalInfo?.sponsor}</p>
						</div>
						<div>
							<span className="italic">Enactment delay</span>
							<p>{proposal?.proposalInfo?.enactmentDelay} blocks</p>
						</div>
					</div>
				</If>
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
