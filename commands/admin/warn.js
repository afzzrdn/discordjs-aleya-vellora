const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ADMIN_ROLE_ID } = require('../../config/ids');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Peringatkan member di server')
        .addUserOption(option => option.setName('user').setDescription('User yang akan diperingatkan').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Alasan peringatan')),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Tidak ada alasan diberikan.';

        if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
            return await interaction.reply({
                content: '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.',
                ephemeral: true
            });
        }

        // Kirim DM ke target (jika bisa)
        try {
            await target.send(
                `⚠️ Haii~ kamu barusan dapat peringatan dari server **${interaction.guild.name}**!\n\n` +
                `**Alasan:** ${reason}\n\n` +
                `Tolong yaa jangan diulangi lagi~ biar suasana server tetap nyaman dan seru untuk semuanya! ✨`
            );
        } catch (err) {
            return await interaction.reply({ content: '⚠️ Gagal mengirim DM ke member tersebut.', ephemeral: true });
        }

        // Balasan ke admin/moderator
        const warnEmbed = new EmbedBuilder()
            .setColor(0xFFA07A)
            .setTitle('🚨 Peringatan Telah Diberikan')
            .addFields(
                { name: '👤 Pengguna', value: `<@${target.id}>`, inline: true },
                { name: '📋 Alasan', value: reason, inline: true }
            )
            .setFooter({ text: 'Peringatan dikirim dengan penuh cinta... dan sedikit ketegasan~ 💢' })
            .setTimestamp();

        await interaction.reply({ embeds: [warnEmbed] });
    }
};
