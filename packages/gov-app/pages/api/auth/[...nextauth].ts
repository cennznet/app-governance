import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
import { DISCORD_CLIENT, TWITTER_CLIENT } from "@gov-app/libs/constants";

export default NextAuth({
	pages: {
		signIn: "/popup/signin",
	},

	providers: [
		TwitterProvider({
			...TWITTER_CLIENT,
			version: "2.0",
			userinfo: {
				url: "https://api.twitter.com/2/users/me",
			},
			profile({ data }) {
				return {
					id: data.id,
					name: `twitter#${data.username}`,
				};
			},
		}),
		DiscordProvider({
			...DISCORD_CLIENT,
			profile(data) {
				return {
					id: data.id,
					name: `discord#${data.username}`,
				};
			},
		}),
	],
});
