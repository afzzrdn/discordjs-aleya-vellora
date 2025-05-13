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
            .setDescription(
                `Aww~ siapa nih yang baru gabung? 🌸\n` +
                `Haii <@${member.id}>~ selamat datang di **${member.guild.name}**~ ✨\n` +
                `Aleya udah nungguin kamu dari tadi loh~ 😳💖\n` +
                `Jangan lupa baca dulu <#1281186721857404969> yaa, biar makin akrab dan nggak dimarahin! 💅✨\n` +
                `Ayo kenalan, kita bakal seru-seruan bareng! 💖`
            )
            .setThumbnail(member.displayAvatarURL())  // Menambahkan avatar member
            .setFooter({ text: 'Semoga betah yaa, Aleya suka banget kalau kamu ada di sini! 💕' })
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
                .setColor(0xFFB6C1)  // Warna soft pink yang manis 💖
                .setTitle('🌸 **Aduh, Ada yang Pergi...** 💔')
                .setDescription(
                    `Ehhh~ <@${member.id}> kok pergi sih...? 😢💔\n` +
                    `Aleya masih pengen banget ngobrol sama kamu loh~ 🌸💖\n` +
                    `Semoga kamu bahagia di tempat baru ya... tapi jangan lupa sama kita di **${member.guild.name}** yaa~ 🥺✨\n` +
                    `Kalau rindu... pintu Aleya selalu terbuka kok~ 💌💖 Kami semua bakal kangen banget! 💕`
                )
                .setThumbnail(member.displayAvatarURL())  // Menambahkan avatar member
                .setFooter({ text: 'Selalu ada tempat untukmu di sini, kapan saja~ 💕' })
                .setTimestamp();

            await channel.send({ embeds: [farewellEmbed] });
        } catch (err) {
            console.error('❌ Gagal mengirim pesan perpisahan:', err);
        }
    }
};
