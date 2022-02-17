module.exports = {
	data: {
		name: 'play',
		description: 'play a song!',
		options: [
			{
				name: 'query',
				description: 'Song to play!',
				type: 3,
				required: true
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

		const query = interaction.options.get('query').value;
		const queue = player.createQueue(interaction.guild, {
			metadata: {
				channel: interaction.channel
			}
		});

		// verify vc connection
		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		}
		catch {
			queue.destroy();
			return await interaction.reply({ content: 'Could not join your voice channel!', ephemeral: true });
		}

		const tracks = await player.search(query, { requestedBy: interaction.user })
			.then(x => x.tracks);

		if (!tracks) {
			return await interaction.followUp({ content: '❌ | No song was found!' });
		}

		if (query.includes('playlist') || query.includes('album') || query.includes('list')) {
			queue.addTracks(tracks);
		}
		else {
			queue.addTrack(tracks[0]);
		}
		queue.play();

		return await interaction.followUp({ content: '⏱️ | Loading track!' });
	}
};