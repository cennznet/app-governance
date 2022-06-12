import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } from "@discord/libs/constants";

const commands = [
	new SlashCommandBuilder().setName("ping").setDescription("Plays Ping Pong"),
	new SlashCommandBuilder().setName("modal").setDescription("Opens modal"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

rest
	.put((Routes as any).applicationGuildCommands(CLIENT_ID, GUILD_ID), {
		body: commands,
	})
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
