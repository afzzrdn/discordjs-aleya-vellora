const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Menampilkan daftar perintah'),
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0xFFB6C1)
            .setTitle('✨ Aleya Vellora — Special Assistant di Server Ini! ✨')
            .setDescription(
                'Hai kak~ (≧◡≦) ♡ Aleya di sini buat bantuin kamu!\n' +
                'Panggil aku kapan aja yaa~\n\n' +
                'Berikut daftar perintah yang bisa kakak pakai:'
            )
            .addFields(
                { name: '💓 /ping', value: 'Cek apakah Aleya lagi online atau lagi bobo cantik~', inline: true },
                { name: '🎀 /owner', value: 'Cari tahu siapa yang bikin Aleya secantik ini~', inline: true },
                { name: '⚠️ /warn', value: 'Tegur member yang nakal biar nggak bandel~', inline: true },
                { name: '🔨 /ban', value: 'Usir member yang kelewat batas... duh duh~', inline: true },
                { name: '💫 /unban', value: 'Maafin dan panggil balik yang udah di-ban~', inline: true },
                { name: '🌙 /afk', value: 'Kasih tau yang lain kalau kakak lagi pergi... tapi jangan lama-lama yaa, Aleya kangen~', inline: true },
                { name: '📖 /help', value: 'Lihat semua perintah yang bisa Aleya bantuin~', inline: true },
                { name: '🎶 /play', value: 'Putar lagu kesukaan kakak~ Biar Aleya jadi DJ kamu hari ini! 💃', inline: true },
                { name: '⏭️ /skip', value: 'Lompat ke lagu berikutnya... mungkin yang ini kurang cocok yaa?~', inline: true },
                { name: '⏹️ /stop', value: 'Berhentiin musik... yah, suasananya jadi sepi deh~', inline: true },
                { name: '📜 /queue', value: 'Liat daftar lagu yang lagi Aleya siapin buat kamu~', inline: true },
                { name: '🔁 /loop', value: 'Putar lagunya terus-terusan, biar makin nempel di hati~', inline: true },
                { name: '🔀 /shuffle', value: 'Acak playlist kamu... kejutan itu seru lho kak~!', inline: true },
                { name: '🎧 /np', value: 'Liat lagu apa yang lagi diputer sekarang~', inline: true },
            )
            .setFooter({ text: 'Gunakan perintahnya dengan hati yang manis yaa~ 💕' })
            .setTimestamp();

            await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }
}