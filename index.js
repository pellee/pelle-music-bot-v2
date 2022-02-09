/* eslint-disable comma-dangle */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const creds = require('./cfg.json');

const commands = [{
	name: 'play',
	description: 'Plays a song!',
	options: [
		{
			name: 'query',
			type: 3,
			description: 'The song you want to play',
			required: true
		},
	]
}];

const rest = new REST({ version: '9' }).setToken(creds.token);

(async () => {
	try {
		console.log('Started refreshing application [/] commands.');

		await rest.put(
			Routes.applicationGuildCommands(creds.botId, creds.guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application [/] commands.');
	}
	catch (error) {
		console.error(error);
	}
})();

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const { Player } = require('discord-player');

// Create a new Player (you don't need any API Key)
const player = new Player(client);

// add the trackStart event so when a song will be played this message will be sent
player.on('trackStart', (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`));

client.once('ready', () => {
	console.log('Im ready !');
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	// /play track:Despacito
	// will play 'Despacito' in the voice channel
	if (interaction.commandName === 'play') {
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });
		const query = interaction.options.get('query').value;
		const queue = player.createQueue(interaction.guild, {
			metadata: {
				channel: interaction.channel
			}
		});

		// verify vc connection
		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		}
		catch {
			queue.destroy();
			return await interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
		}

		await interaction.deferReply();
		const track = await player.search(query, {
			requestedBy: interaction.user
		}).then(x => x.tracks[0]);
		if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

		queue.play(track);

		return await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` });
	}
});

client.login(creds.token);