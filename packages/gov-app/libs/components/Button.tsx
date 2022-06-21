import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC, ReactNode } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";
import { classNames, If } from "react-extras";

interface ButtonProps extends PropsWithChildren {
	variant?: "hero" | "white";
	startAdornment?: ReactNode;
}

export const Button: FC<IntrinsicElements["button"] & ButtonProps> = ({
	variant = "hero",
	type = "button",
	startAdornment,
	className,
	children,
	...props
}) => {
	return (
		<button
			type={type}
			className={classNames(
				className,
				"relative inline-flex items-center px-4 py-1 transition-colors duration-150",
				{
					hero: "bg-hero  border-hero font-display shadow-hero shadow-dark hover:text-hero top-[-4px]  left-[-4px] border-[3px] text-lg uppercase text-white hover:border-white hover:bg-white active:top-0 active:left-0 active:shadow-none",

					white:
						" border-hero  font-display shadow-hero shadow-dark text-hero top-[-4px] left-[-4px] border-[3px] bg-white text-lg uppercase hover:border-white active:top-0 active:left-0 active:shadow-none",
				}[variant]
			)}
			{...props}
		>
			<If condition={!!startAdornment}>
				<span className="mr-2">{startAdornment}</span>
			</If>
			{children}
		</button>
	);
};
