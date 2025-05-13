const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping bot'),
    async execute(interaction) {
        // Mengukur latensi WebSocket menggunakan Discord.js
        const websocketPing = interaction.client.ws.ping;

        // Menghitung latensi bot
        const botPing = Date.now() - interaction.createdTimestamp;

        const pingEmbed = new EmbedBuilder()
            .setColor(0xFFC0CB)
            .setTitle('📡 Pong~!')
            .setDescription(
                `Haii kak~ (≧◡≦)\n` +
                `Aku di sini kok! Aleyaa selalu siap nemenin kakak kapan aja, tinggal panggil aja yaa~ ✨\n\n` +
                `> *Jangan lupa kasih aku perhatian juga ya~ uwu* 💖\n\n` +
                `Kalau ingin tahu perintah apa saja yang bisa aku lakukan, coba ketik **/help** yaa~ 📚`
            )
            .setFooter({ text: 'Aleyaa aktif dan siap membantu~ 💫' })
            .setTimestamp();

        await interaction.reply({ embeds: [pingEmbed], ephemeral: false });
    },
};
