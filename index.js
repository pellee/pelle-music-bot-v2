const { Client, Intents, Collection } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('fs');

const creds = require('./cfg.json');
const slash = require('./deploy-commands.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });


const player = new Player(client);
// add the trackStart event so when a song will be played this message will be sent
player.on('trackStart', (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`));

client.commands = new Collection();
const commadsFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

for (const f of commadsFiles) {
	const command = require(`./commands/${f}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	console.log(interaction.commandName);
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, player);
	}
	catch (error) {
		console.error(error);
	}
});

client.on('messageCreate', async message => {
	if (message.author.bot || !message.guild) return;
	if (!client.application?.owner) await client.application?.fetch();

	if (message.content === '!commands' && message.author.id === client.application?.owner?.id) {
		const commands = [];

		for (const f of commadsFiles) {
			const command = require(`./commands/${f}`);
			client.commands.set(command.data.name, command);
			commands.push(command.data);
		}

		try {
			slash.createSlashCommands(message, commands);
		}
		catch (error) {
			console.log(error);
			message.reply('There was an error executing this command');
		}
	}
});

client.once('ready', () => {
	console.log('Bot on');
});

client.login(creds.token);