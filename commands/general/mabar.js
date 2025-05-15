const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        const username = interaction.user; // dapatkan info user

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

        await interaction.reply({
            content: '@everyone',
            embeds: [mabarEmbed],
            allowedMentions: { parse: ['everyone', 'users'] }
        });
    }
};
