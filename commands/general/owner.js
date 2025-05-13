const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('owner')
        .setDescription('Informasi tentang pembuat bot'),
    async execute(interaction) {
        const ownerEmbed = new EmbedBuilder()
            .setColor(0xFFB6C1)
            .setTitle('💖 Siapa sih yang bikin Aleyaa?')
            .setDescription(
                `Ehehe~ aku diciptakan oleh seseorang yang super baik, super jago, dan pastinya keren banget! ✨\n\n` +
                `👤 Namanya: **<@542229001188671507>**\n` +
                `🌐 Kunjungi websitenya di: [muhammadafzaal.com](https://muhammadafzaal.com)\n\n` +
                `Jangan lupa ucapin makasih yaa, soalnya tanpa dia Aleyaa nggak akan ada~ (≧◡≦)`
            )
            .setFooter({ text: 'Dibuat dengan penuh cinta 💕 oleh Afzaal' })
            .setTimestamp();

        await interaction.reply({ embeds: [ownerEmbed], ephemeral: true });
    }
};
