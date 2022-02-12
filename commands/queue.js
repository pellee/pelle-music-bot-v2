const { MessageEmbed } = require('discord.js');

function buildField(track) {
	return [
		{ name : 'Song', value : `${track.title}`, inline : true },
		{ name : 'Duration', value : `${track.duration}`, inline : true },
		{ name : 'RequestBy', value : `${track.requestedBy.tag}`, inline : true }
	];
}

function buildMessageQueue(tracks, current) {
	const queueMessageEmbed = new MessageEmbed()
		.setColor('GREEN')
		.setTitle('Enqueued Songs!');
	queueMessageEmbed.addFields(buildField(current));

	if (tracks?.length > 0) {
		tracks.forEach(track => {
			queueMessageEmbed.addFields(buildField(track));
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
			await interaction.reply({ content: 'You are not in a voice channel!', ephemeral: true });
		}

		if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
			await interaction.reply({ content: 'You are not in my voice channel!', ephemeral: true });
		}

		await interaction.deferReply();
		const queue = player.getQueue(interaction.guild);

		const embedMessage = buildMessageQueue(queue.tracks, queue.current)
			.setFooter({ text : `Requested By: ${interaction.user.tag}`, iconURL : `${interaction.user.displayAvatarURL({ format : 'png' })}` });

		return await interaction.followUp({ embeds: [embedMessage] });
	}
};