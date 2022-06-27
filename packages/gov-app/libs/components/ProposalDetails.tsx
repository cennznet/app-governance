import type { ChangeEvent, FC } from "react";

import { useState } from "react";
import { classNames, If } from "react-extras";
import RemarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Button, TextField } from "@gov-app/libs/components";

export const ProposalDetails: FC = () => {
	const [showPreview, setShowPreview] = useState<boolean>();
	const [proposalDetails, setProposalDetails] = useState<string>();

	return (
		<div className="w-full">
			<div
				className={classNames(
					"float-right inline-flex space-x-1",
					!showPreview && "mr-[1px]"
				)}
				role="group"
			>
				<Button
					size="small"
					onClick={() => setShowPreview(false)}
					active={!showPreview}
				>
					Write
				</Button>
				<Button
					size="small"
					onClick={() => setShowPreview(true)}
					active={showPreview}
				>
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
					value={proposalDetails}
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setProposalDetails(event.target.value)
					}
					multiline
					required
				/>
			</If>
			<If condition={showPreview}>
				<div className="border-dark flex w-full border-[3px] bg-white px-4 py-2">
					<ReactMarkdown remarkPlugins={[[RemarkGfm, { singleTilde: false }]]}>
						{proposalDetails ?? "Nothing to preview"}
					</ReactMarkdown>
				</div>
			</If>
		</div>
	);
};
