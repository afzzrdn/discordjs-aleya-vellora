const { SlashCommandBuilder } = require('discord.js');
const player = require('../../music/player');

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Hentikan semua musik'),
  async execute(interaction) {
    await player.stop(interaction);
  }
};