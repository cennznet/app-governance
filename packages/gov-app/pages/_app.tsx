import type { AppProps } from "next/app";
import { CENNZ_NETWORK } from "@gov-app/libs/constants";
import CENNZApiProvider from "@gov-app/libs/providers/CENNZApiProvider";
import CENNZExtensionProvider from "@gov-app/libs/providers/CENNZExtensionProvider";
import CENNZWalletProvider from "@gov-app/libs/providers/CENNZWalletProvider";
import UserAgentProvider from "@gov-app/libs/providers/UserAgentProvider";
import WalletProvider from "@gov-app/libs/providers/WalletProvider";
import "@gov-app/libs/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<UserAgentProvider>
			<WalletProvider>
				<CENNZExtensionProvider>
					<CENNZApiProvider endpoint={CENNZ_NETWORK.ApiUrl.InWebSocket}>
						<CENNZWalletProvider>
							<Component {...pageProps} />
						</CENNZWalletProvider>
					</CENNZApiProvider>
				</CENNZExtensionProvider>
			</WalletProvider>
		</UserAgentProvider>
	);
}

export default MyApp;
