const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick member dari server')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User yang akan dikick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Alasan kick')),
    
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Tidak ada alasan diberikan.';
        const member = interaction.guild.members.cache.get(user.id);

        // Cek role ADMIN
        if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
            return await interaction.reply({
                content: '❌ Kamu tidak punya akses buat kick seseorang, hehe~',
                ephemeral: true
            });
        }

        // Cek permission ban
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return await interaction.reply({
                content: '❌ Kamu nggak punya izin khusus buat kick member yaa~',
                ephemeral: true
            });
        }

        if (!member) {
            return await interaction.reply({
                content: '❌ Hmm... Aku nggak nemu member itu di server ini, kak.',
                ephemeral: true
            });
        }

        try {
            // Coba DM user dulu
            try {
                await user.send(
                    `🚫 Haii~ Kamu telah diban dari server **${interaction.guild.name}**.\n\n` +
                    `**Alasannya:** ${reason}\n` +
                    `Kalau kamu merasa ini salah paham, silakan hubungi admin yaa...`
                );
            } catch (err) {
                console.warn('⚠️ Gagal kirim DM ke user sebelum diban.');
            }

            await member.kick({ reason });

            const banEmbed = new EmbedBuilder()
                .setColor(0xFF6961)
                .setTitle('🔨 Ban Telah Diterapkan')
                .addFields(
                    { name: '👤 User', value: `<@${user.id}>`, inline: true },
                    { name: '📋 Alasan', value: reason, inline: true }
                )
                .setFooter({ text: 'Demi kenyamanan semua, tindakan ini harus diambil~' })
                .setTimestamp();

            await interaction.reply({ embeds: [banEmbed] });

        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: '⚠️ Maaf, Aleyaa gagal memban member tersebut.',
                ephemeral: true
            });
        }
    }
}