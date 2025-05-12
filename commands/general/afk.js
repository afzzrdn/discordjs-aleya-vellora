const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AFK_CHANNEL_ID, LOGS_CHANNEL_ID } = require('../../config/ids');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Memindahkanmu ke voice channel AFK'),
    async execute(interaction) {
        const afkChannelId = AFK_CHANNEL_ID; // Tambahkan ID ini di .env
        const welcomeChannelId = LOGS_CHANNEL_ID;

        const member = interaction.member;
        const channel = member.guild.channels.cache.get(welcomeChannelId);

        if (!member.voice.channel) {
            return interaction.reply({ content: '🚫 Kamu tidak berada di voice channel mana pun.', ephemeral: true });
        }

        try {
            await member.voice.setChannel(afkChannelId);
            const afkEmbed = new EmbedBuilder()
                .setColor(0xFFB6C1)  // Warna soft pink yang manis 💖
                .setTitle('💖 **Oh no~!** 😴 **Teman kita AFK!** 💖')
                .setDescription(
                    `Aww, **${member.displayName}** lagi AFK nih!~ 💭💖 Jangan khawatir, kita tungguin kamu balik yaa! 😘💕\n` +
                    `Semoga cepet balik lagi, Aleya kangen loh!~ 🌸✨`
                )
                .setThumbnail(member.displayAvatarURL())  // Menambahkan avatar user di thumbnail
                .setFooter({ text: 'Jangan lama-lama yaa, Aleya tungguin kamu! 💖' })
                .setTimestamp();

            await channel.send({ embeds: [afkEmbed] });
            await interaction.reply({ content: `✅ Kamu udah dipindahkan ke AFK channel, semoga cepet balik yaa~! 💖`});
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: '❌ Aduh, gagal deh memindahkan kamu ke AFK channel... coba lagi nanti ya~', ephemeral: true });
        }
    }
}