import type { NextPage } from "next";

import { FormEventHandler, useCallback, useMemo, useState } from "react";
import { Layout } from "@gov-app/libs/components/Layout";
import { Header } from "@gov-app/libs/components/Header";
import WalletConnect from "@gov-app/libs/components/WalletConnect";
import { toHTML } from "discord-markdown";
import parse from "html-react-parser";
import { If } from "react-extras";

const NewProposal: NextPage = () => {
	const { busy, onFormSubmit } = useFormSubmit();

	const [markdown, setMarkdown] = useState<string>("");
	const markdownOutput = useMemo(() => parse(toHTML(markdown)), [markdown]);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-3xl flex-1 self-center px-8 pb-12">
				<form onSubmit={onFormSubmit} />
				<h1 className="font-display mb-8 text-center text-7xl uppercase">
					Submit a Proposal
				</h1>

				<p className="mb-8 text-center text-lg">
					To submit a proposal you must be a CENNZnet Councillor.
				</p>

				<WalletConnect />
				<input
					type="text"
					value={markdown}
					onChange={(e) => setMarkdown(e.target.value)}
				/>
				<If condition={!!markdownOutput}>{markdownOutput}</If>
			</div>
		</Layout>
	);
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

export default NewProposal;
