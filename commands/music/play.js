const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
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
        highWaterMark: 1 << 25, // untuk stream yang lebih stabil
      }).on('error', (err) => {
        console.error('🚨 Stream error:', err);
      });

      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: false, // opsional, default true
      });

      connection.subscribe(player);
      player.play(resource);

      await interaction.reply(`🎶 Memutar lagu: ${url}`);

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('⏹ Player idle. Disconnecting...');
        connection.destroy();
      });

      player.on('error', error => {
        console.error('💥 Player error:', error);
        connection.destroy();
      });

    } catch (err) {
      console.error('❌ Error di command play:', err);
      try {
        if (!interaction.replied) {
          await interaction.reply('🚨 Terjadi kesalahan saat mencoba memutar lagu.');
        } else {
          await interaction.followUp('🚨 Terjadi kesalahan lanjutan saat memutar lagu.');
        }
      } catch (followErr) {
        console.error('❗ Gagal mengirim error reply:', followErr);
      }
    }
  }
};
