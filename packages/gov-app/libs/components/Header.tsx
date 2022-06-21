import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";
import CENNZLogo from "@gov-app/libs/assets/vectors/cennz-logo.svg";

interface HeaderProps extends PropsWithChildren {}

export const Header: FC<IntrinsicElements["div"] & HeaderProps> = ({
	children,
	...props
}) => {
	return (
		<header {...props} className="py-16 px-20">
			<div className="flex items-center">
				<img
					src={CENNZLogo.src}
					alt="CENNZet"
					className=" block h-20 py-2 pr-6"
				/>
				<div className="border-hero self-stretch border"></div>
				<div className="pl-6">
					<h1 className="font-display text-hero  text-4xl font-normal uppercase">
						Governance
					</h1>
					<h2 className="font-body text-hero uppercase">Platform</h2>
				</div>
			</div>
			{children}
		</header>
	);
};
