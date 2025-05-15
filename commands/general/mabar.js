const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { LOGS_CHANNEL_ID } = require('../../config/ids');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mabar')
        .setDescription('Ajak temen-temen mabar bareng~!')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('Nama game yang mau dimainin 💖')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('slot')
                .setDescription('Berapa slot yang masih kosong? 🎮')
                .setMinValue(1)
                .setMaxValue(10)
                .setRequired(true)
        ),

    async execute(interaction) {
        const game = interaction.options.getString('game');
        const slot = interaction.options.getInteger('slot');
        const username = interaction.user;

        const mabarEmbed = new EmbedBuilder()
            .setColor(0xFFC0CB)
            .setTitle('🌸 Yuk Mabar Bareng! 🌸')
            .setDescription(
                `Ehe~ <@${username.id}> lagi ngajak mabar **${game}** nih! ✨\n` +
                `Masih ada **${slot} slot kosong** lhoo~ 💞\n\n` +
                `Cepetan join sebelum keisi semua~ (≧◡≦) ♡`
            )
            .setFooter({ text: 'Mabar itu ibadah (˶ᵔ ᵕ ᵔ˶)' })
            .setTimestamp();

        const targetChannel = interaction.client.channels.cache.get(LOGS_CHANNEL_ID);

        if (!targetChannel) {
            return interaction.reply({
                content: 'Channel mabar tidak ditemukan 😢 Cek konfigurasi LOGS_CHANNEL_ID.',
                ephemeral: true,
            });
        }

        // Kirim pesan ke channel target dan tag everyone
        await targetChannel.send({
            content: '@everyone',
            embeds: [mabarEmbed],
            allowedMentions: { parse: ['everyone', 'users'] },
        });

        // Beri feedback ke user agar tidak bingung
        await interaction.reply({
            content: 'Ajakan mabar kamu sudah dikirim ke channel mabar dan semua udah di-tag! 🎮✨',
            ephemeral: true,
        });
    }
};
