const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Putar musik dari YouTube')
    .addStringOption(option =>
      option.setName('query').setDescription('Link atau judul lagu').setRequired(true)),
  async execute(interaction) {
    try {
      const query = interaction.options.getString('query');
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return interaction.reply('Kamu harus join voice channel dulu!');
      }

      let url = query;
      if (!ytdl.validateURL(query)) {
        const result = await ytSearch(query);
        if (!result.videos.length) return interaction.reply('Lagu tidak ditemukan!');
        url = result.videos[0].url;
      }

      // Menambahkan log untuk memastikan URL yang valid
      console.log('Playing URL:', url);

      const stream = ytdl(url, { filter: 'audioonly' }).on('error', (err) => {
        console.error("Error with ytdl stream:", err);
        interaction.reply("Terjadi masalah dengan stream audio.");
      });

      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      // Menambahkan log untuk memeriksa resource dan player
      console.log('Audio resource created:', resource);
      console.log('Audio player created:', player);

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      player.play(resource);
      connection.subscribe(player);

      interaction.reply(`🎶 Memutar lagu: ${url}`);

      player.on(AudioPlayerStatus.Idle, () => {
        console.log("Player idle, disconnecting.");
        connection.destroy();
      });
    } catch (err) {
      console.error('Error in play command:', err);
      interaction.reply('Terjadi kesalahan saat memutar lagu.');
    }
  }
};