import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC, ReactNode } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";
import { classNames, If } from "react-extras";

interface SelectProps extends PropsWithChildren {
	placeholder?: string;
	endAdornment?: ReactNode;
	inputClassName?: string;
}

export const Select: FC<IntrinsicElements["select"] & SelectProps> = ({
	children,
	placeholder,
	endAdornment,
	className,
	inputClassName,
	value,
	...props
}) => {
	return (
		<div
			className={classNames(
				className,
				"border-dark flex w-full items-center border-[3px] bg-white"
			)}
		>
			<If condition={!value && !!placeholder}>
				<div
					className={classNames(
						inputClassName,
						"mr-2 flex-1 bg-white px-4 py-2 text-gray-400"
					)}
				>
					{placeholder}
				</div>
			</If>
			<If condition={!!value || !placeholder}>
				<select
					{...props}
					value={value}
					className={classNames(
						inputClassName,
						"mr-2 flex-1 border border-white bg-white px-4 py-2 outline-none"
					)}
				>
					<If condition={!!placeholder}>
						<option value="" disabled hidden>
							{placeholder}
						</option>
					</If>
					{children}
				</select>
			</If>

			<If condition={!!endAdornment}>
				<span className="px-2">{endAdornment}</span>
			</If>
		</div>
	);
};
