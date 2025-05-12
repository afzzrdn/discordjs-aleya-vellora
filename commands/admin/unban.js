const { SlashCommandBuilder } = require('discord.js');
const { ADMIN_ROLE_ID } = require('../../config/ids');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban member dari server')
        .addStringOption(option => option.setName('user_id').setDescription('ID pengguna yang dibatalkan ban-nya').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Alasan unban')),

    async execute(interaction) {
        const userId = interaction.options.getString('user_id');
        const reason = interaction.options.getString('reason') || 'Tidak ada alasan diberikan.';

        if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
        return await interaction.reply({
            content: '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.',
            ephemeral: true
        });
        }

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
        return await interaction.reply({
            content: '❌ Kamu tidak memiliki izin untuk membatalkan ban pengguna.',
            ephemeral: true
        });
        }

        try {
        await interaction.guild.members.unban(userId, reason);
        await interaction.reply(`✅ Pengguna dengan ID \`${userId}\` telah dibatalkan ban-nya.\nAlasan: ${reason}`);
        } catch (err) {
        console.error(err);
        await interaction.reply('⚠️ Gagal membatalkan ban pengguna. Pastikan ID pengguna valid dan mereka memang dibanned.');
        }
    }
};
