module.exports = {
	data: {
		name: 'volume',
		description: 'set/get the volume of the song!',
		options: [
			{
				name: 'amount',
				description: 'the amount of volumen',
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
		await interaction.deferReply();

		const queue = player.getQueue(interaction.guildId);
		const amount = interaction.options.get('amount')?.value;

		if (typeof amount != 'undefined') {
			if (amount <= 100 && amount > 0) {
				return await interaction.followUp({ content: await queue.setVolume(amount) ? `The volume has been set in: ${amount}!` : 'There was an error setting the volume' });
			}
			else {
				return await interaction.followUp({ content: 'The amount has to be a number between 0 and 100' });
			}
		}

		return await interaction.followUp({ content: `The current amount of volume is set in: ${queue.volume}` });
	}
};