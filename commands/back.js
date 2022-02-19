module.exports = {
	data: {
		name: 'back',
		description: 'go to the previous song!'
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

		await queue.back();
		return await interaction.followUp({ content: 'going to the previous song ✅' });
	}
};