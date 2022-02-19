module.exports = {
	data: {
		name: 'clean',
		description: 'clean the queue!'
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

		await queue.clear();
		return await interaction.followUp({ content: 'The queue is clean!' });
	}
};