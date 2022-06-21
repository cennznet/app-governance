import type { NextPage } from "next";
import { Layout } from "@gov-app/libs/components/Layout";
import { Header } from "@gov-app/libs/components/Header";
import { useCallback } from "react";
import { useWindowPopup } from "@gov-app/libs/hooks/useWindowPopup";
import { useSession } from "next-auth/react";
import { Button } from "@gov-app/libs/components/Button";
import { ReactComponent as DiscordLogo } from "@gov-app/libs/assets/vectors/discord.svg";
import { ReactComponent as TwitterLogo } from "@gov-app/libs/assets/vectors/twitter.svg";

const Connect: NextPage = () => {
	const popWindow = useWindowPopup();
	const { data: session, status } = useSession();

	const onTwitterConnectClick = useCallback(() => {
		popWindow("/popup/signin?provider=twitter", "TwitterAuth");
	}, [popWindow]);

	const onDiscordConnectClick = useCallback(() => {
		popWindow("/popup/signin?provider=discord", "DiscordAuth");
	}, [popWindow]);

	return (
		<Layout>
			<Header />
			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="flex">
					<Button
						onClick={onTwitterConnectClick}
						className="mr-2"
						startAdornment={<TwitterLogo />}
					>
						Sign In
					</Button>

					<Button
						onClick={onDiscordConnectClick}
						variant="white"
						startAdornment={<DiscordLogo />}
					>
						Sign In
					</Button>
				</div>
			</div>
		</Layout>
	);
};

export default Connect;
