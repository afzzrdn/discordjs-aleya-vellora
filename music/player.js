const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

async function joinAndPlay(voiceChannel, query, interaction) {
  try {
    const stream = ytdl(query, { filter: 'audioonly', highWaterMark: 1 << 25 });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    await interaction.editReply(`🎵 Memutar: **${query}**`);
  } catch (err) {
    console.error(err);
    await interaction.editReply('❌ Gagal memutar lagu.');
  }
}

module.exports = { joinAndPlay };
