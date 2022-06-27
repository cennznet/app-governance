import type { ChangeEvent, FC } from "react";

import { If } from "react-extras";
import parse from "html-react-parser";
import { toHTML } from "discord-markdown";
import { useState, useMemo } from "react";
import { Button, TextField } from "@gov-app/libs/components";

export const ProposalDetails: FC = () => {
	const [showPreview, setShowPreview] = useState<boolean>();

	const { details, onDetailsChange, detailsMarkdown } = useProposalDetails();

	return (
		<div className="w-full">
			<div className="float-right mr-[1px] inline-flex" role="group">
				<Button size="small" onClick={() => setShowPreview(false)}>
					Write
				</Button>
				<Button size="small" onClick={() => setShowPreview(true)}>
					Preview
				</Button>
			</div>
			<label htmlFor="proposalDetails" className="text-lg">
				Proposal Details
			</label>
			<If condition={!showPreview}>
				<TextField
					id="proposalDetails"
					inputClassName="w-full"
					value={details}
					onChange={onDetailsChange}
					multiline
					required
				/>
			</If>
			<If condition={showPreview}>
				<div className="border-dark flex w-full border-[3px] bg-white px-4 py-2">
					{detailsMarkdown}
				</div>
			</If>
		</div>
	);
};

const useProposalDetails = () => {
	const [details, setDetails] = useState<string>("");
	const detailsMarkdown = useMemo(() => parse(toHTML(details)), [details]);

	const onDetailsChange = (event: ChangeEvent<HTMLInputElement>) =>
		setDetails(event.target.value);

	return {
		details,
		onDetailsChange,
		detailsMarkdown,
	};
};
