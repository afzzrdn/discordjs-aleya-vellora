const kataKasar = require('../utils/kataKasar');

module.exports = {
  handleMessageCreate: async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const found = kataKasar.find(word => content.includes(word));

    if (found) {
      try {
        await message.delete();

        // Pesan publik ke channel
        await message.channel.send({
          content: `🚫 Haii <@${message.author.id}>~ Pesanmu mengandung kata yang tidak sopan dan sudah aku hapus yaa~ 💢 Tolong dijaga bahasanya, biar semua nyaman~ 🌸`,
          allowedMentions: { users: [message.author.id] }
        });

        // DM pribadi ke user
        try {
          await message.author.send(
            `⚠️ Hai kak ${message.author.username}~\nPesanmu barusan dihapus karena mengandung kata tidak pantas: **${found}**.\n` +
            `Yuk kita jaga suasana server tetap ramah dan positif yaa~ ✨`
          );
        } catch (err) {
          console.warn('📭 Gagal mengirim DM ke pengguna.');
        }

      } catch (err) {
        console.error('❌ Gagal menghapus pesan:', err);
      }
    }
  }
};
