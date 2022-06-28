import type { NextPage, NextPageContext } from "next";
import type { ProposalInterface } from "@proposal-relayer/libs/types";
import type { ProposalVote } from "@gov-app/libs/types";

import { Choose, If } from "react-extras";
import { useCallback, useEffect, useState } from "react";
import {
	Button,
	Header,
	Layout,
	ProposalDetailsDisplay,
	WalletConnect,
} from "@gov-app/libs/components";
import { fetchProposal } from "@gov-app/libs/utils/fetchProposal";
import { Spinner } from "@gov-app/libs/assets/vectors";
import { useCENNZApi } from "@gov-app/libs/providers/CENNZApiProvider";
import { useCENNZWallet } from "@gov-app/libs/providers/CENNZWalletProvider";
import { SubmittableResult } from "@cennznet/api";

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
	const { busy, onVoteClick } = useVote(proposalId);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<h1 className="font-display mb-6 text-center text-6xl uppercase">
					Proposal #{proposalId}
				</h1>

				<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
					Connect your wallet
				</h2>
				<p className="mb-8">
					Lorem laborum dolor minim mollit eu reprehenderit culpa dolore labore
					dolor mollit commodo do anim incididunt sunt id pariatur elit tempor
					nostrud nulla eu proident ut id qui incididunt.
				</p>
				<WalletConnect />

				<Choose>
					<Choose.When condition={!proposal}>
						<Spinner className="m-auto h-8 w-8 animate-spin" />
					</Choose.When>

					<Choose.When condition={!!proposal}>
						<ProposalDetailsDisplay
							proposalDetails={proposal?.proposalDetails}
							proposalInfo={proposal?.proposalInfo}
						/>

						<div
							className="mt-12 inline-flex w-full justify-center space-x-12"
							role="group"
						>
							{["pass", "reject"].map((vote: ProposalVote, index) => (
								<Button
									size="medium"
									disabled={busy[vote]}
									className="w-1/4 text-center"
									onClick={() => onVoteClick(vote)}
									key={index}
								>
									<div className="flex items-center justify-center">
										<If condition={busy[vote]}>
											<span className="mr-2">
												<Spinner />
											</span>
										</If>
										<span>{busy[vote] ? "Processing..." : vote}</span>
									</div>
								</Button>
							))}
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

const useVote = (proposalId: string) => {
	const { api } = useCENNZApi();
	const { selectedAccount, wallet } = useCENNZWallet();
	const signer = wallet?.signer;

	const [busy, setBusy] = useState({
		pass: false,
		reject: false,
	});

	const onVoteClick = useCallback(
		async (vote: ProposalVote) => {
			if (!api || !selectedAccount?.address || !signer) return;
			setBusy({ ...busy, [vote]: true });

			await api.tx.governance
				.voteOnProposal(proposalId, vote === "pass")
				.signAndSend(
					selectedAccount.address,
					{ signer },
					(result: SubmittableResult) => {
						const { txHash } = result;
						console.info("Transaction", txHash.toString());
					}
				);

			setBusy({
				pass: false,
				reject: false,
			});
		},
		[api, selectedAccount?.address, signer, busy, proposalId]
	);

	return { busy, onVoteClick };
};
