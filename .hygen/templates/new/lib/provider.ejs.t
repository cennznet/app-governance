---
to: "packages/<%= package %>/libs/providers/<%= name %>.tsx"
---
<%
 nameOnly = name.replace("Provider", "");
%>import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC, createContext, useContext } from "react";

interface <%= nameOnly %>ContextType {}
const <%= nameOnly %>Context = createContext<<%= nameOnly %>ContextType>(
	{} as <%= nameOnly %>ContextType
);

interface <%= name %>Props extends PropsWithChildren {}
export const <%= name %>: FC<<%= name %>Props> = ({
	children,
	...props
}) => {
	return (
		<<%= nameOnly %>Context.Provider value={{}} {...props}>
			{children}
		</<%= nameOnly %>Context.Provider>
	);
};

export const use<%= nameOnly %> = (): <%= nameOnly %>ContextType => {
	return useContext(<%= nameOnly %>Context);
};
