import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";
import { classNames } from "react-extras";

interface ButtonProps extends PropsWithChildren {
	variant?: "hero" | "white";
}

export const Button: FC<IntrinsicElements["button"] & ButtonProps> = ({
	variant = "hero",
	type = "button",
	className,
	children,
	...props
}) => {
	return (
		<button
			type={type}
			className={classNames(
				className,
				"relative inline-flex px-4 py-1 transition-colors duration-150",
				{
					hero: "bg-hero  border-hero font-display shadow-hero shadow-dark hover:text-hero top-[-4px]  left-[-4px] border-[3px] text-lg uppercase text-white hover:border-white hover:bg-white active:top-0 active:left-0 active:shadow-none",

					white:
						" border-hero  font-display shadow-hero shadow-dark text-hero top-[-4px] left-[-4px] border-[3px] bg-white text-lg uppercase hover:border-white active:top-0 active:left-0 active:shadow-none",
				}[variant]
			)}
			{...props}
		>
			{children}
		</button>
	);
};
