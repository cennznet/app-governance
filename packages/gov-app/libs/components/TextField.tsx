import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC, ReactNode } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";
import { classNames, If } from "react-extras";

interface TextFieldProps extends PropsWithChildren {
	endAdornment?: ReactNode;
	inputClassName?: string;
}

export const TextField: FC<IntrinsicElements["input"] & TextFieldProps> = ({
	type = "text",
	endAdornment,
	className,
	inputClassName,
	children,
	...props
}) => {
	return (
		<div
			className={classNames(
				className,
				"border-dark flex w-full items-center justify-between border-[3px] bg-white"
			)}
		>
			<input
				{...props}
				type={type}
				className={classNames(
					inputClassName,
					"min-w-0 flex-shrink px-4 py-2 outline-none"
				)}
			/>
			<If condition={!!endAdornment}>
				<span className="flex-shrink-0 px-2">{endAdornment}</span>
			</If>
		</div>
	);
};
