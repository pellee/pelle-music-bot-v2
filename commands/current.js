const { MessageEmbed } = require('discord.js');

module.exports = {
	data: {
		name: 'current',
		description: 'current song!',
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
		const playerTime = queue.getPlayerTimestamp();

		const embedMessage = new MessageEmbed()
			.setColor('GREEN')
			.setTitle('Playing!')
			.setDescription(`**${queue.current.title}** (${playerTime.progress})`)
			.addFields({ name: '\u200B', value: queue.createProgressBar() })
			.setFooter({ text : `Requested By: ${interaction.user.tag}`, iconURL : `${interaction.user.displayAvatarURL({ format : 'png' })}` });

		return await interaction.followUp({ embeds: [embedMessage] });
	}
};