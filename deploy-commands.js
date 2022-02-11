const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const creds = require('./cfg.json');

function createSlashCommands(message, commands) {
	const rest = new REST({ version: '9' }).setToken(creds.token);
	(async () => {
		try {
			await rest.put(
				Routes.applicationGuildCommands(creds.botId, creds.guildId),
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