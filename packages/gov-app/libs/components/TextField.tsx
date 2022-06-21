import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC } from "react";
import { IntrinsicElements } from "@gov-app/libs/types";

interface TextFieldProps extends PropsWithChildren {}

export const TextField: FC<IntrinsicElements["div"] & TextFieldProps> = ({
	children,
	...props
}) => {
	return <div {...props}>{children}</div>;
}
