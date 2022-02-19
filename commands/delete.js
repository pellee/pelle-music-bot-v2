module.exports = {
	data: {
		name: 'delete',
		description: 'delete a song from the queue!',
		options: [
			{
				name: 'song',
				description: 'the id of the song you want to delete',
				type: 4,
				required: true
			}
		]
	},
	async execute(interaction, player) {
		if (!interaction.member.voice.channelId) {
			return await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });
		}
		await interaction.deferReply();

		const queue = player.getQueue(interaction.guildId);
		let idxSong = interaction.options.get('song')?.value;

		if (idxSong > queue.tracks.length + 1 || idxSong < 2) {
			return await interaction.followUp({ content: `Has to be a number between 2 and ${queue.tracks.length + 1}` });
		}
		idxSong -= 2;
		const trackName = queue.tracks[idxSong].title;
		queue.remove(idxSong);

		return await interaction.followUp({ content: `Has been removed the track: ${trackName}!` });
	}
};