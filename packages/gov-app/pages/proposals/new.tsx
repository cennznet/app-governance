import type { NextPage } from "next";

import { If } from "react-extras";
import {
	Button,
	Header,
	Layout,
	ProposalAdvanced,
	ProposalDetails,
	TextField,
	WalletConnect,
} from "@gov-app/libs/components";
import { Spinner } from "@gov-app/libs/assets/vectors";
import { ChangeEvent, FormEventHandler, useCallback, useState } from "react";
import { useCENNZApi } from "@gov-app/libs/providers/CENNZApiProvider";
import { useCENNZWallet } from "@gov-app/libs/providers/CENNZWalletProvider";
import { pinProposalToIPFS } from "@gov-app/libs/utils/pinProposalToIPFS";
import { IPFS_GATEWAY } from "@gov-app/libs/constants";

const NewProposal: NextPage = () => {
	const [proposalTitle, setProposalTitle] = useState<string>("");
	const [proposalDetails, setProposalDetails] = useState<string>("");
	const [proposalExtrinsic, setProposalExtrinsic] = useState<string>("");
	const [proposalDelay, setProposalDelay] = useState<number>(0);

	const { busy, onFormSubmit } = useFormSubmit(
		proposalTitle,
		proposalDetails,
		proposalExtrinsic,
		proposalDelay
	);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<form onSubmit={onFormSubmit}>
					<h1 className="font-display mb-8 text-center text-7xl uppercase">
						Submit a Proposal
					</h1>

					<p className="mb-8 text-center text-lg">
						To submit a proposal you must be a CENNZnet Councillor.
					</p>

					<WalletConnect />

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Enter proposal details
					</h2>
					<p className="mb-8">
						The <em>justification</em> section supports markdown! Refer to{" "}
						<a
							href="https://assets.discohook.app/discord_md_cheatsheet.pdf"
							target="_blank"
							rel="noreferrer"
							className="border-hero border-b italic"
						>
							this cheatsheet
						</a>{" "}
						to take advantage.
					</p>

					<fieldset className="space-y-6">
						<div>
							<label htmlFor="proposalTitle" className="text-lg">
								Title
							</label>
							<TextField
								id="proposalTitle"
								inputClassName="w-full"
								value={proposalTitle}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setProposalTitle(e.target.value)
								}
								required
							/>
						</div>

						<ProposalDetails
							proposalDetails={proposalDetails}
							setProposalDetails={setProposalDetails}
						/>

						<div>
							<label htmlFor="proposalDelay" className="text-lg">
								Enactment Delay <span className="text-base">(# blocks)</span>
							</label>
							<TextField
								id="proposalDelay"
								type="number"
								placeholder={"0"}
								inputClassName="w-full"
								value={proposalDelay}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setProposalDelay(Number(e.target.value))
								}
								required
							/>
						</div>
					</fieldset>

					<ProposalAdvanced
						proposalExtrinsic={proposalExtrinsic}
						setProposalExtrinsic={setProposalExtrinsic}
					/>

					<fieldset className="mt-16 text-center">
						<Button type="submit" className="w-1/3 text-center" disabled={busy}>
							<div className="flex items-center justify-center">
								<If condition={busy}>
									<span className="mr-2">
										<Spinner />
									</span>
								</If>
								<span>{busy ? "Processing..." : "Sign and Submit"}</span>
							</div>
						</Button>
						<p className="mt-2 text-sm">Estimated gas fee 2 CPAY</p>
					</fieldset>
				</form>
			</div>
		</Layout>
	);
};

export default NewProposal;

const useFormSubmit = (
	proposalTitle: string,
	proposalDetails: string,
	proposalExtrinsic: string,
	proposalDelay: number
) => {
	const [busy, setBusy] = useState<boolean>(false);

	const { api } = useCENNZApi();
	const { selectedAccount } = useCENNZWallet();

	const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		async (event) => {
			event.preventDefault();

			if (
				!api ||
				!proposalTitle ||
				!proposalDetails ||
				!proposalDelay ||
				!selectedAccount
			)
				return;
			setBusy(true);

			const { IpfsHash } = await pinProposalToIPFS({
				proposalTitle,
				proposalDetails,
			});

			const tx = api.tx.governance.submitProposal(
				proposalExtrinsic,
				IPFS_GATEWAY.concat(IpfsHash),
				proposalDelay
			);

			setTimeout(() => {
				setBusy(false);
			}, 2000);
		},
		[
			api,
			proposalTitle,
			proposalDetails,
			proposalExtrinsic,
			proposalDelay,
			selectedAccount,
		]
	);

	return { busy, onFormSubmit };
};
