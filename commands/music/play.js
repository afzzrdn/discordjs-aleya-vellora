const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Putar musik dari YouTube')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Link atau judul lagu')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction) {
    let connection;
    let isDestroyed = false;

    try {
      const query = interaction.options.getString('query');
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return await interaction.reply('❌ Kamu harus join voice channel dulu!');
      }

      let url = query;
      if (!ytdl.validateURL(query)) {
        const result = await ytSearch(query);
        if (!result.videos.length) {
          return await interaction.reply('❌ Lagu tidak ditemukan!');
        }
        url = result.videos[0].url;
      }

      console.log('🎧 Memutar URL:', url);

      const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      });

      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      connection.subscribe(player);
      player.play(resource);

      await interaction.reply(`🎶 Memutar lagu: ${url}`);

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('⏹ Player idle.');
        safelyDestroy(connection);
      });

      player.on('error', error => {
        console.error('💥 Player error:', error);
        safelyDestroy(connection);
      });

      stream.on('error', error => {
        console.error('🚨 Stream error:', error);
        safelyDestroy(connection);
      });

      function safelyDestroy(conn) {
        if (!isDestroyed && conn.state.status !== VoiceConnectionStatus.Destroyed) {
          conn.destroy();
          isDestroyed = true;
          console.log('🔌 Voice connection destroyed safely.');
        }
      }

    } catch (err) {
      console.error('❌ Error di command play:', err);
      if (!interaction.replied) {
        await interaction.reply('🚨 Terjadi kesalahan saat mencoba memutar lagu.');
      } else {
        await interaction.followUp('🚨 Terjadi kesalahan lanjutan saat memutar lagu.');
      }

      // Pastikan koneksi dihancurkan jika belum
      if (connection && !isDestroyed) {
        connection.destroy();
        isDestroyed = true;
      }
    }
  }
};
