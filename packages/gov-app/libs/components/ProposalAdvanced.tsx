import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

import { useState } from "react";
import { classNames, If } from "react-extras";
import { TextField } from "@gov-app/libs/components";
import { NULL_ADDRESS } from "@gov-app/libs/constants";
import { ChevronDown } from "@gov-app/libs/assets/vectors";

interface ProposalAdvancedProps {
	proposalExtrinsic: string;
	setProposalExtrinsic: Dispatch<SetStateAction<string>>;
}

export const ProposalAdvanced: FC<ProposalAdvancedProps> = ({
	proposalExtrinsic,
	setProposalExtrinsic,
}) => {
	const [open, setOpen] = useState<boolean>();

	return (
		<div className="w-full">
			<div
				className={classNames(
					"mt-6 inline-flex cursor-pointer items-center text-lg",
					open && "mb-4"
				)}
				onClick={() => setOpen(!open)}
			>
				Advanced{" "}
				<span className={classNames("duration-200", open && "rotate-180")}>
					<ChevronDown />
				</span>
			</div>
			<br />
			<If condition={open}>
				<label htmlFor="cennzExtrinsic" className="text-lg">
					Extrinsic Hash
				</label>
				<TextField
					id="cennzExtrinsic"
					inputClassName="w-full truncate"
					placeholder={NULL_ADDRESS}
					value={proposalExtrinsic}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setProposalExtrinsic(e.target.value)
					}
				/>
			</If>
		</div>
	);
};
