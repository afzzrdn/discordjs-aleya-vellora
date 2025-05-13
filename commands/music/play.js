const { SlashCommandBuilder } = require('discord.js');

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
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return await interaction.reply('❌ Kamu harus join voice channel dulu!');
    }

    try {
      // Memutar lagu dengan DisTube
      await client.distube.play(voiceChannel, query, {
        textChannel: interaction.channel,
        member: interaction.member,
      });

      await interaction.reply(`🎶 Sedang memutar: **${query}**`);
    } catch (err) {
      console.error('💥 DisTube Error:', err);
      await interaction.reply('🚨 Terjadi kesalahan saat memutar lagu.');
    }
  },
};
