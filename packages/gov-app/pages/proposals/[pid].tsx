import type { NextPage } from "next";
import type { ProposalInterface } from "@proposal-relayer/libs/types";

import { Choose } from "react-extras";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header, Layout } from "@gov-app/libs/components";
import { fetchProposal } from "@gov-app/libs/utils/fetchProposal";
import { Spinner } from "@gov-app/libs/assets/vectors";

const Proposal: NextPage = () => {
	const router = useRouter();
	const { pid } = router.query;

	const proposal = useProposal(pid as string);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<h1 className="font-display mb-6 text-center text-6xl uppercase">
					Proposal #{pid}
				</h1>
				<Choose>
					<Choose.When condition={!proposal}>
						<Spinner className="m-auto h-8 w-8 animate-spin" />
					</Choose.When>
					<Choose.When condition={!!proposal}>
						<div className="space-y-6">
							<span className="border-hero border-b-2 text-4xl">
								{proposal?.proposalDetails?.title}
							</span>
							<div className="flex w-full space-x-20">
								<div>
									<span className="italic">Enactment delay</span>
									<p>{proposal?.proposalInfo?.enactmentDelay} blocks</p>
								</div>
								<div>
									<span className="italic">Sponsor</span>
									<p>{proposal?.proposalInfo?.sponsor}</p>
								</div>
							</div>
						</div>
						<div className="border-hero my-6 w-full border-b-2" />
						<div>
							<p className="text-xl">
								{proposal?.proposalDetails?.description}
							</p>
						</div>
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
