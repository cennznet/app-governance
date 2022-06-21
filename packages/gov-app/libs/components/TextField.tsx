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
				"border-dark flex w-full items-center border-[3px] bg-white"
			)}
		>
			<input
				{...props}
				type={type}
				className={classNames(inputClassName, "flex-1 px-4 py-2 outline-none")}
			/>
			<If condition={!!endAdornment}>
				<span className="px-2">{endAdornment}</span>
			</If>
		</div>
	);
};
