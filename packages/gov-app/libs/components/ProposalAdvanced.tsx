import type { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

import { useState } from "react";
import { TextField } from "@gov-app/libs/components";
import { classNames, If } from "react-extras";
import { ChevronDown } from "@gov-app/libs/assets/vectors";

interface ProposalAdvancedProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ProposalAdvanced: FC<ProposalAdvancedProps> = ({
	open,
	setOpen,
}) => {
	const [extrinsicHash, setExtrinsicHash] = useState<string>();

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
					value={extrinsicHash}
					onChange={(e: ChangeEvent<HTMLInputElement>) =>
						setExtrinsicHash(e.target.value)
					}
				/>
			</If>
		</div>
	);
};
