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
import { Select } from "@gov-app/libs/components/Select";

const Connect: NextPage = () => {
	const popWindow = useWindowPopup();
	// const { data: session, status } = useSession();

	// const onTwitterConnectClick = useCallback(() => {
	// 	popWindow("/popup/signin?provider=twitter", "TwitterAuth");
	// }, [popWindow]);

	// const onDiscordConnectClick = useCallback(() => {
	// 	popWindow("/popup/signin?provider=discord", "DiscordAuth");
	// }, [popWindow]);

	return (
		<Layout>
			<Header />
			<div className="w-full max-w-2xl flex-1 self-center px-8">
				<form>
					<h1 className="font-display mb-8 text-center text-7xl uppercase">
						Set your identity
					</h1>

					<p className="mb-8 text-lg">
						To become a Citizen or Councillor, we need you to verify your
						identity. This involves connecting your wallet, and two social
						channels (Twitter and Discord). Get started below!
					</p>

					<fieldset className="mb-12">
						<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
							Connect your wallet
						</h2>
						<p className="mb-8 text-lg">
							Lorem laborum dolor minim mollit eu reprehenderit culpa dolore
							labore dolor mollit commodo do anim incididunt sunt id pariatur
							elit tempor nostrud nulla eu proident ut id qui incididunt.
						</p>
						<div className="flex items-center">
							<Select
								placeholder="Connect CENNZnet Wallet"
								inputClassName="!py-4"
								required
								endAdornment={
									<Button
										size="small"
										startAdornment={<CENNZLogo className="h-4" />}
									>
										Connect
									</Button>
								}
							></Select>
						</div>
					</fieldset>

					<fieldset className="mb-12">
						<h2 className="font-display border-hero mb-4 border-b-2 text-4xl uppercase">
							Connect your social channels
						</h2>
						<p className="mb-8 text-lg">
							Lorem laborum dolor minim mollit eu reprehenderit culpa dolore
							labore dolor mollit commodo do anim incididunt sunt id pariatur
							elit tempor nostrud nulla eu proident ut id qui incididunt.
						</p>

						<div className="mb-6 flex items-center">
							<TextField
								placeholder="Sign-in to Twitter"
								className="flex-1"
								inputClassName="!py-4"
								required
								endAdornment={
									<Button
										size="small"
										startAdornment={<TwitterLogo className="h-4" />}
									>
										Sign In
									</Button>
								}
							/>
						</div>

						<div className="flex items-center">
							<TextField
								placeholder="Sign-in to Discord"
								className="flex-1"
								inputClassName="!py-4"
								required
								endAdornment={
									<Button
										size="small"
										startAdornment={<DiscordLogo className="h-4" />}
									>
										Sign In
									</Button>
								}
							/>
						</div>
					</fieldset>

					<fieldset className="text-center">
						<Button type="submit" className="w-1/3 text-center">
							Submit
						</Button>
					</fieldset>
				</form>
			</div>
		</Layout>
	);
};

export default Connect;
