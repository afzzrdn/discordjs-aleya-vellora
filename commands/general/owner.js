const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('owner')
        .setDescription('Informasi tentang pembuat bot'),
    async execute(interaction) {
        await interaction.reply('🌸 Aku dibuat oleh seorang yang sangat baik hati, yaitu <@542229001188671507>. Kunjungi https://muhammadafzaal.com untuk mengetahui penciptaku! 💖');
    }
}