---
to: "packages/<%= package %>/libs/providers/<%= name %>Provider.tsx"
---
import type { PropsWithChildren } from "@gov-app/libs/types";

import { FC, createContext, useContext } from "react";

interface <%= name %>ContextType {}
const <%= name %>Context = createContext<<%= name %>ContextType>(
	{} as <%= name %>ContextType
);

interface <%= name %>ProviderProps extends PropsWithChildren {}
export const <%= name %>: FC<<%= name %>ProviderProps> = (props) => {
	return <<%= name %>Context.Provider value={{}} {...props} />;
};

export const use<%= name %> = (): <%= name %>ContextType => {
	return useContext(<%= name %>Context);
};
