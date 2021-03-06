require ('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('fs');

// const creds = require('./cfg.json');
const slash = require('./deploy-commands.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const player = new Player(client);
// add the trackStart event so when a song will be played this message will be sent
player.on('trackStart', (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`));

player.on('botDisconnect', (queue) => queue.metadata.channel.send('I been disconect from the channel'));

player.on('channelEmpty', (queue) => queue.metadata.channel.send('The channel voice is empty'));

player.on('connectionCreate', function(queue, connection) {
	queue.metadata.channel.send('Joining the channel!');
	connection.connectionTimeout = 60000;
});

player.on('connectionError', function(queue, error) {
	queue.metadata.channel.send('There was an error!');
	console.log(error);
});

player.on('error', (queue, error) => {
	queue.metadata.channel.send('There was an error with the player!');
	console.log(error);
});

player.on('queueEnd', (queue) => {
	queue.metadata.channel.send('Queue end!');
});

client.commands = new Collection();
const commadsFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

for (const f of commadsFiles) {
	const command = require(`./commands/${f}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		if (command == 'lyrics') {
			await command.execute(interaction);
		}
		else {
			await command.execute(interaction, player);
		}
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

client.login(process.env.TOKEN);