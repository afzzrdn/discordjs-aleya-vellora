const { SlashCommandBuilder } = require('discord.js');
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
        await target.send(`⚠️ Kamu telah diberi peringatan di server **${interaction.guild.name}**.\nAlasan: ${reason}`);
        } catch (err) {
        return await interaction.reply({ content: '⚠️ Gagal mengirim DM.' });
        }

        await interaction.reply(`✅ <@${target.id}> telah diperingatkan.\n📝 Alasan: ${reason}`);
    }
};
