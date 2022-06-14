---
to: "packages/<%= package %>/libs/components/<%= name %>.tsx"
---
import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC } from "react";
import { IntrinsicElements } from "@<%= package %>/libs/types";

interface <%= name %>Props extends PropsWithChildren {}

export const <%= name %>: FC<IntrinsicElements["div"] & <%= name %>Props> = ({
	children,
	...props
}) => {
	return <div {...props}>{children}</div>;
}
