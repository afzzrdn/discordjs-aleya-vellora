const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping bot'),
    async execute(interaction) {
        await interaction.reply('✨ Hai, aku di sini! Ping aku kapan saja, aku selalu siap menemani! 💖');
    },
};
