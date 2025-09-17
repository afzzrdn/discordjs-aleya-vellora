const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

function isYouTubeUrl(str) {
  return /^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(str) || /^https?:\/\/youtu\.be\//.test(str);
}

async function joinAndPlay(voiceChannel, query, interaction) {
  try {
    let videoUrl = query;

    // Jika bukan URL, cari dari judul
    if (!isYouTubeUrl(query)) {
      const result = await ytSearch(query);
      const video = result.videos.length > 0 ? result.videos[0] : null;

      if (!video) {
        return interaction.editReply('❌ Lagu tidak ditemukan di YouTube.');
      }

      videoUrl = video.url;
    }

    const stream = ytdl(videoUrl, {
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

    await interaction.editReply(`🎵 Memutar: **${videoUrl}**`);
  } catch (err) {
    console.error(err);
    await interaction.editReply('❌ Gagal memutar lagu.');
  }
}

module.exports = { joinAndPlay };
