process.env.FFMPEG_PATH = require('@ffmpeg-installer/ffmpeg').path;

const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queues = new Map();

async function playSong(guild, song, interaction) {
  const serverQueue = queues.get(guild.id);

  if (!song) {
    const connection = getVoiceConnection(guild.id);
    if (connection) connection.destroy();
    queues.delete(guild.id);
    return;
  }

  const stream = ytdl(song.url, { filter: 'audioonly', highWaterMark: 1 << 25 });
  const resource = createAudioResource(stream);
  serverQueue.player.play(resource);

  serverQueue.connection.subscribe(serverQueue.player);

  serverQueue.player.once(AudioPlayerStatus.Idle, () => {
    serverQueue.songs.shift();
    playSong(guild, serverQueue.songs[0], interaction);
  });

  await interaction.followUp(`▶️ Memutar: **${song.title}**`);
}

module.exports = {
  queues,
  async executePlay(interaction, query) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply('🔇 Kamu harus join voice channel.');

    const search = await ytSearch(query);
    if (!search.videos.length) return interaction.reply('❌ Lagu tidak ditemukan.');

    const song = {
      title: search.videos[0].title,
      url: search.videos[0].url,
    };

    let serverQueue = queues.get(interaction.guild.id);

    if (!serverQueue) {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();
      queues.set(interaction.guild.id, {
        voiceChannel,
        connection,
        player,
        songs: [song],
      });

      await interaction.reply(`📥 Menambahkan ke antrian: **${song.title}**`);
      playSong(interaction.guild, song, interaction);
    } else {
      serverQueue.songs.push(song);
      await interaction.reply(`📥 Ditambahkan ke antrian: **${song.title}**`);
    }
  },

  skip(interaction) {
    const serverQueue = queues.get(interaction.guild.id);
    if (!serverQueue) return interaction.reply('🚫 Tidak ada lagu yang diputar.');
    serverQueue.player.stop();
    return interaction.reply('⏭️ Lagu dilewati.');
  },

  stop(interaction) {
    const serverQueue = queues.get(interaction.guild.id);
    if (!serverQueue) return interaction.reply('🚫 Tidak ada yang bisa dihentikan.');
    serverQueue.songs = [];
    serverQueue.player.stop();
    return interaction.reply('🛑 Musik dihentikan.');
  }
};
