const { SlashCommandBuilder } = require('discord.js');
const player = require('../../music/player');

module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Lewati lagu'),
  async execute(interaction) {
    await player.skip(interaction);
  }
};