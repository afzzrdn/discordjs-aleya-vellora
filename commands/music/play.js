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

    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    player.play(resource);
    connection.subscribe(player);

    client.audioPlayer = player;

    interaction.reply(`🎶 Memutar lagu: ${url}`);

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());
  }
};