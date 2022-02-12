module.exports = {
	data: {
		name: 'pause',
		description: 'pause current song!',
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
		const paused = queue.setPaused(true);

		return await interaction.followUp({ content: paused ? '⏸ Music paused' : '❌ Musice already paused' });

	}
};