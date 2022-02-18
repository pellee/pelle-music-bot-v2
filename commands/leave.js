module.exports = {
	data: {
		name: 'leave',
		description: 'disconnect the bot from the voice channel!',
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

		if (!queue) {
			return await interaction.followUp({ content: 'Im not in the voice channel' });
		}
		queue.connection.disconnect();

		return await interaction.followUp({ content: 'I been disconect from the channel 💤' });

	}
};