import type { NextPage } from "next";

import {
	ChangeEvent,
	FormEventHandler,
	useCallback,
	useMemo,
	useState,
} from "react";
import { toHTML } from "discord-markdown";
import parse from "html-react-parser";
import { classNames, If } from "react-extras";
import {
	Button,
	Header,
	Layout,
	ProposalAdvanced,
	TextField,
	WalletConnect,
} from "@gov-app/libs/components";
import { ChevronDown, Spinner } from "@gov-app/libs/assets/vectors";

const NewProposal: NextPage = () => {
	const { busy, onFormSubmit } = useFormSubmit();

	const { markdown, onMarkdownChange, markdownOutput } = useMarkdown();

	const [proposalTitle, setProposalTitle] = useState<string>("");

	const [advancedOpen, setAdvancedOpen] = useState<boolean>();

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

					<label htmlFor="proposalDetails" className="text-lg">
						Proposal Details
					</label>
					<TextField
						id="proposalDetails"
						className="mb-6"
						inputClassName="w-full"
						value={markdown}
						onChange={onMarkdownChange}
						multiline
						required
					/>
					<If condition={!!markdown}>
						<label htmlFor="markdownOutput" className="text-lg">
							Markdown Output
						</label>
						<div
							id="markdownOutput"
							className="border-dark w-full border-[3px] bg-white px-4 py-2"
						>
							{markdownOutput}
						</div>
					</If>

					<div
						className={classNames(
							"inline-flex cursor-pointer items-center text-lg",
							advancedOpen && "mb-4"
						)}
						onClick={() => setAdvancedOpen(!advancedOpen)}
					>
						Advanced{" "}
						<span
							className={classNames(
								"duration-200",
								advancedOpen && "rotate-180"
							)}
						>
							<ChevronDown />
						</span>
					</div>
					<If condition={advancedOpen}>
						<ProposalAdvanced />
					</If>

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

const useMarkdown = () => {
	const [markdown, setMarkdown] = useState<string>("");
	const markdownOutput = useMemo(() => parse(toHTML(markdown)), [markdown]);

	const onMarkdownChange = (event: ChangeEvent<HTMLInputElement>) =>
		setMarkdown(event.target.value);

	return {
		markdown,
		onMarkdownChange,
		markdownOutput,
	};
};

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
