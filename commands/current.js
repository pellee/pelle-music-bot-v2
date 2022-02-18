const { MessageEmbed } = require('discord.js');

module.exports = {
	data: {
		name: 'current',
		description: 'current song!',
	},
	async execute(interaction, player) {
		if (!interaction.member.voice.channelId) {
			await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });
		}

		await interaction.deferReply();

		const queue = player.getQueue(interaction.guild);
		const existPlaylist = queue.current.playlist ? true : false;
		const embedMessage = new MessageEmbed()
			.setColor('GREEN')
			.setAuthor({ name: queue.current.author })
			.setThumbnail(queue.current.thumbnail)
			.setTitle(`🔊 Playing: ${queue.current.title} ${existPlaylist ? '-' + queue.current.playlist.title : ''}`)
			.setURL(existPlaylist ? queue.current.playlist.url : queue.current.url)
			.addFields({ name: '\u200B', value: queue.createProgressBar() })
			.setFooter({ text : `Requested By: ${queue.current.requestedBy.username}` });

		return await interaction.followUp({ embeds: [embedMessage] });
	}
};