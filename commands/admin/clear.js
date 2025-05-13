const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Menghapus sejumlah pesan dari channel ini')
        .addIntegerOption(option =>
            option.setName('jumlah')
                .setDescription('Jumlah pesan yang ingin dihapus (1-100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // hanya moderator/admin
    async execute(interaction) {
        const jumlah = interaction.options.getInteger('jumlah');

        if (jumlah < 1 || jumlah > 100) {
            return await interaction.reply({
                content: 'Jumlah harus antara 1 dan 100 ya kak~ 😳',
                ephemeral: true
            });
        }

        // Hapus pesan
        const messages = await interaction.channel.bulkDelete(jumlah, true);

        const clearEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('🧹 Channel dibersihkan~!')
            .setDescription(`Berhasil menghapus **${messages.size}** pesan dari channel ini, kak~ ✨`)
            .setFooter({ text: 'Aleyaa rajin bersih-bersih juga loh~ 🧼' })
            .setTimestamp();

        await interaction.reply({ embeds: [clearEmbed], ephemeral: true });
    },
};
