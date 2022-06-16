export const CENNZ_NETWORK: string = process.env.CENNZ_NETWORK || "rata";

export const MONGODB_SERVER: string =
	process.env.MONGODB_SERVER || "mongodb://root:root@localhost:27017/admin";
export const RABBBITMQ_SERVER: string =
	process.env.RABBBITMQ_SERVER || "amqp://guest:guest@localhost:5672";

export const MESSAGE_MAX_TIME = Number(process.env.MESSAGE_MAX_TIME || 30000);
export const MESSAGE_MAX_RETRY = Number(process.env.MESSAGE_MAX_RETRY || 3);

export const DISCORD_BOT = {
	AvatarUrl: process.env.DISCORD_AVATAR || "",
	BotName: process.env.DISCORD_BOT_NAME || "",
	ClientId: process.env.DISCORD_CLIENT_ID || "",
	ChannelId: process.env.DISCORD_CHANNEL_ID || "",
	GuildId: process.env.DISCORD_GUILD_ID || "",
	Token: process.env.DISCORD_TOKEN || "",
	WebhookId: process.env.DISCORD_WEBHOOK_ID || "",
};
