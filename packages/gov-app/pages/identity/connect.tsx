import type { NextPage } from "next";
import { Layout } from "@gov-app/libs/components/Layout";
import { Header } from "@gov-app/libs/components/Header";
import { useCallback } from "react";
import { useWindowPopup } from "@gov-app/libs/hooks/useWindowPopup";
import { useSession } from "next-auth/react";

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
					<button
						onClick={onTwitterConnectClick}
						type="button"
						className="mr-2"
					>
						Connect Twitter
					</button>

					<button onClick={onDiscordConnectClick} type="button">
						Connect Discord
					</button>
				</div>
			</div>
		</Layout>
	);
};

export default Connect;
