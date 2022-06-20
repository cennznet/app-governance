import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
import { DISCORD_CLIENT, TWITTER_CLIENT } from "@gov-app/libs/constants";

export default NextAuth({
	providers: [
		TwitterProvider({
			...TWITTER_CLIENT,
			version: "2.0",
			userinfo: {
				url: "https://api.twitter.com/2/users/me",
				params: { "user.fields": "profile_image_url" },
			},
		}),
		DiscordProvider(DISCORD_CLIENT),
	],
});
