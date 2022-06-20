import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";
import TopLogo from "@gov-app/libs/assets/vectors/top-logo.svg";

interface HeaderProps extends PropsWithChildren {}

export const Header: FC<IntrinsicElements["div"] & HeaderProps> = ({
	children,
	...props
}) => {
	return (
		<header {...props} className="py-16 px-20">
			<img
				src={TopLogo.src}
				className="w-96"
				alt="CENNZet | Governance Platform"
			/>
			{children}
		</header>
	);
};
