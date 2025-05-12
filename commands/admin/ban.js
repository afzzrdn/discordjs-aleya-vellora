const { SlashCommandBuilder } = require('discord.js');
const { ADMIN_ROLE_ID } = require('../../config/ids');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban member dari server')
        .addUserOption(option => option.setName('user').setDescription('User yang akan diban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Alasan ban')),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Tidak ada alasan diberikan.';
        const member = interaction.guild.members.cache.get(user.id);

        if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
        return await interaction.reply({
            content: '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.',
            ephemeral: true
        });
        }

        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
        return await interaction.reply({
            content: '❌ Kamu tidak memiliki izin untuk mem-banned member.',
            ephemeral: true
        });
        }

        if (!member) {
        return await interaction.reply({
            content: '❌ Pengguna tidak ditemukan di server ini.',
            ephemeral: true
        });
        }

        try {
        await member.ban({ reason });
        await interaction.reply(`✅ <@${user.id}> telah diban.\nAlasan: ${reason}`);
        } catch (err) {
        console.error(err);
        await interaction.reply('⚠️ Gagal mem-banned pengguna.');
        }
    }
};
