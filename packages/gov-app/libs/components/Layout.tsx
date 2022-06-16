import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";

interface LayoutProps extends PropsWithChildren {}

export const Layout: FC<IntrinsicElements["div"] & LayoutProps> = ({
	children,
	...props
}) => {
	return (
		<>
			<div className="fixed inset-0 bg-mid"></div>
			<div {...props} className="relative flex flex-col h-full">
				{children}
			</div>
			<div className="fixed inset-0 border-8 border-hero"></div>
		</>
	);
};
