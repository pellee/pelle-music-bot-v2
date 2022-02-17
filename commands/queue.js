const { MessageEmbed } = require('discord.js');

function buildFields(track, idx) {

	console.log(track);
	return [
		{ name : 'Id', value : `${idx}`, inline : true },
		{ name : 'Song', value : `${track.title}`, inline : true },
		{ name : 'Duration', value : `${track.duration}`, inline : true },
		{ name : 'User', value : `${track.requestedBy.tag}`, inline : true }
	];
}

function buildMessageQueue(tracks, current) {
	let i = 0;
	const queueMessageEmbed = new MessageEmbed()
		.setColor('GREEN')
		.setTitle('Enqueued Songs!');
	queueMessageEmbed.addFields(buildFields(current, i += 1));

	if (tracks?.length > 0) {
		tracks.forEach(track => {
			queueMessageEmbed.addFields(buildFields(track, i += 1));
		});
	}

	return queueMessageEmbed;
}

module.exports = {
	data: {
		name: 'queue',
		description: 'get queue of songs!',
	},
	async execute(interaction, player) {
		if (!interaction.member.voice.channelId) {
			return await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			return await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });
		}

		await interaction.deferReply();
		const queue = player.getQueue(interaction.guild);

		if (!queue?.tracks && !queue?.current) {
			return await interaction.followUp({ content: 'No songs been played!', ephemeral: true });
		}

		const embedMessage = buildMessageQueue(queue.tracks, queue.current)
			.setFooter({ text : '.' + '\u3000'.repeat(32) + `Queue length: ${queue.tracks.length + 1}` });

		return await interaction.followUp({ embeds: [embedMessage] });
	}
};