module.exports = {
	data: {
		name: 'skip',
		description: 'skip a song!',
		options: [
			{
				name: 'skip-to',
				description: 'skip to a particular song in the queue!',
				type: 4,
				required: false
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

		const queue = player.getQueue(interaction.guildId);
		let skipTo = interaction.options.get('skip-to')?.value;
		let message;

		await interaction.deferReply();

		if (skipTo != undefined) {
			skipTo--;

			queue.skipTo(skipTo);
			message = `Skipping **${queue.current.title}**`;
		}
		else {
			message = queue.skip() ? `Skipping **${queue.current.title}**` : 'There was an error skipping the song.';
		}

		return await interaction.followUp({ content: message });
	}
};