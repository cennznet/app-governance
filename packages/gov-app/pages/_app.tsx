import "@gov-app/libs/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import { CENNZ_NETWORK } from "@gov-app/libs/constants";
import { MainProvider } from "@gov-app/libs/providers/MainProvider";
import { CENNZApiProvider } from "@gov-app/libs/providers/CENNZApiProvider";
import { CENNZExtensionProvider } from "@gov-app/libs/providers/CENNZExtensionProvider";
import { CENNZWalletProvider } from "@gov-app/libs/providers/CENNZWalletProvider";
import { UserAgentProvider } from "@gov-app/libs/providers/UserAgentProvider";
import { WalletProvider } from "@gov-app/libs/providers/WalletProvider";
import { FC } from "react";

const NextApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
	return (
		<MainProvider
			providers={[
				<UserAgentProvider />,
				<WalletProvider />,
				<CENNZExtensionProvider />,
				<CENNZApiProvider endpoint={CENNZ_NETWORK.ApiUrl.InWebSocket} />,
				<CENNZWalletProvider />,
			]}
		>
			<Head>
				<title>CENNZnet | Governance Platform</title>
				<meta name="description" content="CENNZnet Governance" />
				<link
					rel="stylesheet"
					type="text/css"
					href="https://use.typekit.net/sxj0edc.css"
				/>
			</Head>
			<Component {...pageProps} />
		</MainProvider>
	);
};

export default NextApp;
