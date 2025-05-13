const { SlashCommandBuilder } = require('discord.js');
const { joinAndPlay } = require('../../music/player.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Memutar lagu dari YouTube')
    .addStringOption(option =>
      option.setName('judul')
        .setDescription('Judul atau URL lagu YouTube')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction) {
    const title = interaction.options.getString('judul');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: 'Kamu harus berada di voice channel dulu!', ephemeral: true });
    }

    await interaction.deferReply();
    await joinAndPlay(voiceChannel, title, interaction);
  }
};
