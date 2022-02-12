module.exports = {
	data: {
		name: 'resume',
		description: 'resume the song paused!',
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
		const paused = queue.setPaused(false);

		return await interaction.followUp({ content: paused ? '🎶 Music resumed' : '❌ Music already playing' });
	}
};