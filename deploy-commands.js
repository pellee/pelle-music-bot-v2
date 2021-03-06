require ('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// const creds = require('./cfg.json');

function createSlashCommands(message, commands) {
	const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
	(async () => {
		try {
			await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, message.guildId),
				{ body: commands },
			);
			message.reply('Commands added!');
		}
		catch (error) {
			console.error(error);
			message.reply('There was an error trying tu add the commands. Make sure the bot has application.commands permission!');
		}
	})();

}

module.exports = { createSlashCommands };