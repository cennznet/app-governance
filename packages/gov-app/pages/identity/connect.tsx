import type { NextPage } from "next";
import { Layout } from "@gov-app/libs/components/Layout";
import { Header } from "@gov-app/libs/components/Header";
import { useCallback } from "react";
import { useWindowPopup } from "@gov-app/libs/hooks/useWindowPopup";
import { useSession } from "next-auth/react";
import { Button } from "@gov-app/libs/components/Button";
import { ReactComponent as DiscordLogo } from "@gov-app/libs/assets/vectors/discord.svg";
import { ReactComponent as TwitterLogo } from "@gov-app/libs/assets/vectors/twitter.svg";
import { ReactComponent as CENNZLogo } from "@gov-app/libs/assets/vectors/cennz.svg";
import { TextField } from "@gov-app/libs/components/TextField";

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

				<div className="mt-4 flex w-[520px] items-center">
					<TextField
						placeholder="Sign-in to Twitter"
						className="mr-4 flex-1"
						inputClassName="!py-4"
						disabled
						endAdornment={
							<Button
								size="small"
								startAdornment={<TwitterLogo className="h-4" />}
							>
								Sign In
							</Button>
						}
					/>

					<Button
						onClick={onTwitterConnectClick}
						className="flex-shrink-0"
						startAdornment={<TwitterLogo />}
					>
						Sign In
					</Button>
				</div>

				<div className="mt-4 flex w-[520px] items-center">
					<TextField
						placeholder="Connect CENNZnet Wallet"
						inputClassName="!py-4"
						disabled
						endAdornment={
							<Button
								size="small"
								startAdornment={<CENNZLogo className="h-4" />}
							>
								Connect
							</Button>
						}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default Connect;
