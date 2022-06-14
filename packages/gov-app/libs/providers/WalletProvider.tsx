import type { WalletOption, PropsWithChildren } from "@gov-app/libs/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useMetaMaskExtension } from "@gov-app/libs/providers/MetaMaskExtensionProvider";
import store from "store";

interface WalletContextType {
	selectedWallet: WalletOption;
	setSelectedWallet: Dispatch<SetStateAction<WalletOption>>;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

interface WalletProviderProps extends PropsWithChildren {}

const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
	const [selectedWallet, setSelectedWallet] = useState<WalletOption>();

	useEffect(() => {
		if (!selectedWallet) return setSelectedWallet(store.get("SELECTED-WALLET"));

		store.set("SELECTED-WALLET", selectedWallet);
	}, [selectedWallet]);

	return (
		<WalletContext.Provider
			value={{
				selectedWallet,
				setSelectedWallet,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};

export default WalletProvider;

export function useWalletProvider(): WalletContextType {
	return useContext(WalletContext);
}
