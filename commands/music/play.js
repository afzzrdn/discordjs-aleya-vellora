const { SlashCommandBuilder } = require('discord.js');
const player = require('../../music/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Putar lagu atau tambahkan ke antrian')
    .addStringOption(opt => opt.setName('query').setDescription('Judul lagu atau URL').setRequired(true)),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    await player.executePlay(interaction, query);
  }
};




