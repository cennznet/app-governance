import type { NextPage } from "next";
import { Layout } from "@gov-app/libs/components/Layout";
import { Header } from "@gov-app/libs/components/Header";
import { useCallback } from "react";
import { useWindowPopup } from "@gov-app/libs/hooks/useWindowPopup";
import { useSession } from "next-auth/react";
import { Button } from "@gov-app/libs/components/Button";

const Connect: NextPage = () => {
	const popWindow = useWindowPopup();
	const { data: session, status } = useSession();

	const onTwitterConnectClick = useCallback(() => {
		popWindow("/popup/signin?provider=twitter", "TwitterAuth");
	}, [popWindow]);

	const onDiscordConnectClick = useCallback(() => {
		popWindow("/popup/signin?provider=discord", "DiscordAuth");
	}, [popWindow]);

	console.log({ session, status });

	return (
		<Layout>
			<Header />
			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="flex">
					<Button onClick={onTwitterConnectClick} className="mr-2">
						Connect Twitter
					</Button>

					<Button onClick={onDiscordConnectClick} variant="white">
						Connect Discord
					</Button>
				</div>
			</div>
		</Layout>
	);
};

export default Connect;
