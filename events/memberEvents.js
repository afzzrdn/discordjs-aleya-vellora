const { EmbedBuilder } = require('discord.js');
const { LOGS_CHANNEL_ID, AFK_CHANNEL_ID, AUTO_ROLE_ID } = require('../config/ids');

module.exports = {
    handleMemberJoin: async (client, member) => {
        const channel = member.guild.channels.cache.get(LOGS_CHANNEL_ID);
        const role = member.guild.roles.cache.get(AUTO_ROLE_ID);

        if (!channel) return console.log('⚠️ Welcome channel tidak ditemukan.');
        if (!role) return console.log('⚠️ Role otomatis tidak ditemukan.');

        try {
        await member.roles.add(role);
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0xFFB6C1)
            .setTitle('✨ **Yeay! Ada yang baru datang~!** ✨')
            .setDescription(`Aww~ siapa nih yang baru gabung? 🌸 Haii <@${member.id}>~ selamat datang!`)
            .setThumbnail(member.displayAvatarURL())
            .setFooter({ text: 'Semoga betah yaa!' })
            .setTimestamp();

        await channel.send({ embeds: [welcomeEmbed] });
        } catch (err) {
        console.error('❌ Gagal mengirim pesan selamat datang:', err);
        }
    },

    handleMemberLeave: async (client, member) => {
        const channel = member.guild.channels.cache.get(LOGS_CHANNEL_ID);

        if (!channel) return console.log('⚠️ Goodbye channel tidak ditemukan.');

        try {
        const farewellEmbed = new EmbedBuilder()
            .setColor(0xFFB6C1)
            .setTitle('🌸 **Aduh, Ada yang Pergi...** 💔')
            .setDescription(`Ehhh~ <@${member.id}> kok pergi sih...? 😢💔`)
            .setThumbnail(member.displayAvatarURL())
            .setFooter({ text: 'Selalu ada tempat untukmu di sini!' })
            .setTimestamp();

        await channel.send({ embeds: [farewellEmbed] });
        } catch (err) {
        console.error('❌ Gagal mengirim pesan perpisahan:', err);
        }
    }
};
