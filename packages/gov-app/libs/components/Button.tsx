import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC, ReactNode } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";
import { classNames, If } from "react-extras";

interface ButtonProps extends PropsWithChildren {
	variant?: "hero" | "white";
	size?: "small" | "medium" | "large";
	startAdornment?: ReactNode;
}

export const Button: FC<IntrinsicElements["button"] & ButtonProps> = ({
	variant = "hero",
	type = "button",
	size = "medium",
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
				"relative inline-flex items-center transition-colors duration-150",
				{
					hero: "bg-hero  border-hero font-display shadow-sharp shadow-dark hover:text-hero hover:bg-light top-[-3px] left-[-3px] border-[3px] uppercase text-white active:top-0 active:left-0 active:shadow-none",

					white:
						" border-hero  font-display shadow-sharp shadow-dark text-hero hover:bg-light top-[-3px] left-[-3px] border-[3px] bg-white uppercase active:top-0 active:left-0 active:shadow-none",
				}[variant],

				{
					small: "px-2 py-1 text-sm",
					medium: "px-4 py-1 text-lg",
				}[size]
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
