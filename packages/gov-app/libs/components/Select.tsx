import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";

interface SelectProps extends PropsWithChildren {}

export const Select: FC<IntrinsicElements["div"] & SelectProps> = ({
	children,
	...props
}) => {
	return <div {...props}>{children}</div>;
}
