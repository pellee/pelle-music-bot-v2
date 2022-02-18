const { QueueRepeatMode } = require('discord-player');

module.exports = {
	data: {
		name: 'loop',
		description: 'set loop a type!',
		options: [
			{
				name: 'type',
				description: 'type of loop!',
				type: 4,
				required: true,
				choices: [
					{
						name : 'off',
						value : QueueRepeatMode.OFF
					},
					{
						name : 'track',
						value : QueueRepeatMode.TRACK
					},
					{
						name : 'queue',
						value : QueueRepeatMode.QUEUE
					},
					{
						name : 'autoplay',
						value : QueueRepeatMode.AUTOPLAY
					}
				]
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
		const choice = interaction.options.get('type').value;
		let message;

		switch (choice) {
		case QueueRepeatMode.OFF:
			message = 'Loop mode desactivated!';
			break;
		case QueueRepeatMode.TRACK:
			message = 'Loop track 🔂';
			break;
		case QueueRepeatMode.QUEUE:
			message = 'Loop queue 🔁';
			break;
		case QueueRepeatMode.AUTOPLAY:
			message = 'Autoplay activated ▶️';
			break;
		default:
			message = 'The choice does not exist';
			break;
		}

		return await interaction.followUp({ content: queue.setRepeatMode(choice) ? message : 'There was an error trying to execute this command' });
	}
};