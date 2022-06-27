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

const NewProposal: NextPage = () => {
	const [proposalTitle, setProposalTitle] = useState<string>("");
	const [advancedOpen, setAdvancedOpen] = useState<boolean>();

	const { busy, onFormSubmit } = useFormSubmit();

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

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Connect your wallet
					</h2>
					<p className="mb-8">
						Lorem laborum dolor minim mollit eu reprehenderit culpa dolore
						labore dolor mollit commodo do anim incididunt sunt id pariatur elit
						tempor nostrud nulla eu proident ut id qui incididunt.
					</p>
					<WalletConnect />

					<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
						Enter proposal details
					</h2>
					<p className="mb-8">
						The proposal details section supports markdown! Refer to{" "}
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

					<label htmlFor="proposalTitle" className="text-lg">
						Proposal Title
					</label>
					<TextField
						id="proposalTitle"
						className="mb-6"
						inputClassName="w-full"
						value={proposalTitle}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setProposalTitle(e.target.value)
						}
						required
					/>

					<ProposalDetails />

					<ProposalAdvanced open={advancedOpen} setOpen={setAdvancedOpen} />

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

const useFormSubmit = () => {
	const [busy, setBusy] = useState<boolean>(false);
	const onFormSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(event) => {
			event.preventDefault();

			setBusy(true);

			setTimeout(() => {
				setBusy(false);
			}, 2000);
		},
		[]
	);

	return { busy, onFormSubmit };
};
