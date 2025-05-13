const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

async function joinAndPlay(voiceChannel, query, interaction) {
  try {
    // Cari video dari judul
    const result = await ytSearch(query);
    const video = result.videos.length > 0 ? result.videos[0] : null;

    if (!video) {
      return interaction.editReply('❌ Lagu tidak ditemukan di YouTube.');
    }

    const stream = ytdl(video.url, {
      filter: 'audioonly',
      highWaterMark: 1 << 25
    });

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

    await interaction.editReply(`🎵 Memutar: **${video.title}**`);
  } catch (err) {
    console.error(err);
    await interaction.editReply('❌ Gagal memutar lagu.');
  }
}

module.exports = { joinAndPlay };
