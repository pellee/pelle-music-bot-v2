const { Lyrics } = require('@discord-player/extractor');
const { MessageEmbed } = require('discord.js');
const lyricsClient = Lyrics.init();

module.exports = {
	data: {
		name: 'lyrics',
		description: 'search lyrics of a song!',
		options: [
			{
				name: 'song',
				description: 'the song you want to know the lyrics!',
				type: 3,
				required: true
			}
		]
	},
	async execute(interaction) {
		if (!interaction.member.voice.channelId) {
			await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });
		}

		await interaction.deferReply();

		let embedMessage;

		await lyricsClient.search(interaction.options.get('song').value)
			.then(song => {
				embedMessage = new MessageEmbed()
					.setColor('GREEN')
					.setTitle(`Now Playing ${song.title}`)
					.setDescription(song.lyrics)
					.setFooter({ text : `Requested By: ${interaction.user.tag}`, iconURL : `${interaction.user.displayAvatarURL({ format : 'png' })}` });
			})
			.catch(await interaction.followUp({ content: 'Lyrics not found' }));

		await lyricsClient.search(interaction.options.get('song').value)
			.then(function(song) {
				embedMessage = new MessageEmbed()
					.setColor('GREEN')
					.setTitle(`Now Playing ${song.title}`)
					.setDescription(song.lyrics)
					.setFooter({ text : `Requested By: ${interaction.user.tag}`, iconURL : `${interaction.user.displayAvatarURL({ format : 'png' })}` });
			})
			.catch(function(error) {
				console.log(error);
				interaction.followUp({ content: 'Lyrics not found' });
			});

		return await interaction.followUp({ embeds: [embedMessage] });

	}
};