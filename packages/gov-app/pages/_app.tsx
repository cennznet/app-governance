import type { AppProps } from "next/app";

import "@gov-app/libs/globals.css";

import { CENNZ_NETWORK } from "@gov-app/libs/constants";
import CENNZApiProvider from "@gov-app/libs/providers/CENNZApiProvider";
import CENNZExtensionProvider from "@gov-app/libs/providers/CENNZExtensionProvider";
import CENNZWalletProvider from "@gov-app/libs/providers/CENNZWalletProvider";
import MetaMaskExtensionProvider from "@gov-app/libs/providers/MetaMaskExtensionProvider";
import MetaMaskWalletProvider from "@gov-app/libs/providers/MetaMaskWalletProvider";
import UserAgentProvider from "@gov-app/libs/providers/UserAgentProvider";
import WalletProvider from "@gov-app/libs/providers/WalletProvider";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserAgentProvider>
			<MetaMaskExtensionProvider>
				<WalletProvider>
					<CENNZExtensionProvider>
						<CENNZApiProvider endpoint={CENNZ_NETWORK.ApiUrl.InWebSocket}>
							<MetaMaskWalletProvider>
								<CENNZWalletProvider>
									<Component {...pageProps} />
								</CENNZWalletProvider>
							</MetaMaskWalletProvider>
						</CENNZApiProvider>
					</CENNZExtensionProvider>
				</WalletProvider>
			</MetaMaskExtensionProvider>
		</UserAgentProvider>
	);
}

export default MyApp;
