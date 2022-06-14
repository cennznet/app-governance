export interface PropsWithChildren {
	children?: ReactNode;
}

export type WalletOption = "CENNZnet" | "Ethereum";

export interface MetaMaskAccount {
	address: string;
}
