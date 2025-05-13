const { SlashCommandBuilder } = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Putar musik dari YouTube')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Link atau judul lagu')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction) {
    try {
      const query = interaction.options.getString('query');
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply('❌ Kamu harus join voice channel terlebih dahulu!');
      }

      let url = query;
      if (!ytdl.validateURL(query)) {
        const result = await ytSearch(query);
        if (!result.videos.length) {
          return interaction.reply('🔍 Lagu tidak ditemukan!');
        }
        url = result.videos[0].url;
      }

      console.log('🎧 Memutar URL:', url);

      const stream = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25, // Buffer besar agar tidak ngadat
      });

      const resource = createAudioResource(stream, { inlineVolume: true });
      resource.volume.setVolume(1.0); // Volume 100%

      const player = createAudioPlayer();

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      // Tunggu sampai koneksi siap
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

      connection.subscribe(player);
      player.play(resource);

      interaction.reply(`🎶 Sedang memutar: **${url}**`);

      // Logging dan event listener
      player.on(AudioPlayerStatus.Playing, () => {
        console.log('✅ AudioPlayer status: Playing');
      });

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('ℹ️ Player selesai. Menutup koneksi...');
        connection.destroy();
      });

      player.on('error', error => {
        console.error('❌ Terjadi kesalahan saat memutar audio:', error.message);
      });

    } catch (err) {
      console.error('🔥 Error di command /play:', err);
      interaction.reply('🚨 Terjadi kesalahan saat memutar lagu.');
    }
  }
};
