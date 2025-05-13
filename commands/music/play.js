const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Putar musik dari YouTube')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Link atau judul lagu')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  // Autocomplete handler untuk memberikan hasil pencarian YouTube
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();

    try {
      const result = await ytSearch(focusedValue);
      const videos = result.videos.slice(0, 5);

      await interaction.respond(
        videos.map(video => ({
          name: `${video.title} (${video.timestamp})`, // Yang tampil
          value: video.url, // Kirim URL sebagai value
        }))
      );
    } catch (error) {
      console.error('Autocomplete error:', error);
      await interaction.respond([]);
    }
  },

  // Command handler untuk memutar musik
  async execute(interaction) {
    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return await interaction.reply({
        content: '❌ Kamu harus join voice channel dulu!',
        ephemeral: true
      });
    }

    const distube = interaction.client.distube;

    if (!distube) {
      return await interaction.reply({
        content: '❌ DisTube belum siap.',
        ephemeral: true
      });
    }

    try {
      // 👉 Wajib untuk response lebih dari 3 detik
      await interaction.deferReply({ ephemeral: false });

      // Jika query bukan URL, cari di YouTube
      let finalQuery = query;
      if (!query.startsWith('http')) {
        const result = await ytSearch(query);
        if (result.videos.length === 0) {
          return await interaction.editReply('❌ Lagu tidak ditemukan.');
        }
        finalQuery = result.videos[0].url; // Ambil URL video pertama
      }

      await distube.play(voiceChannel, finalQuery, {
        textChannel: interaction.channel,
        member: interaction.member,
      });

      const botAvatarUrl = interaction.client.user.displayAvatarURL();

      const musicEmbed = new EmbedBuilder()
        .setColor(0xFF69B4) // Warna pink centil ✨
        .setTitle('🎶 **Yeay, Musiknya Mulai!** 🎧')
        .setDescription(`Omo~ Sekarang kita dengerin **${query}** bareng-bareng~ 💕`)
        .setThumbnail(botAvatarUrl)
        .setFooter({ text: 'Semoga betah ya, dengerin lagu ini terus! 🌸' })
        .setTimestamp()

      await interaction.editReply({ embeds: [musicEmbed] });
    } catch (err) {
      console.error('💥 DisTube Error:', err);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '🚨 Terjadi kesalahan saat memutar lagu.',
          ephemeral: true,
        });
      } else {
        await interaction.editReply('🚨 Terjadi kesalahan saat memutar lagu.');
      }
    }
  },
};
