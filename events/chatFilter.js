const kataKasar = require('../utils/kataKasar');

module.exports = {
  handleMessageCreate: async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const found = kataKasar.find(word => content.includes(word));

    if (found) {
      try {
        await message.delete();
        await message.channel.send(`🚫 **${message.author.username}**, kata tersebut tidak diperbolehkan.`);
        try {
          await message.author.send(`⚠️ Pesan kamu dihapus karena mengandung kata tidak pantas: **${found}**.`);
        } catch (err) {
          console.log('DM gagal dikirim.');
        }
      } catch (err) {
        console.error('Gagal menghapus pesan:', err);
      }
    }
  }
};
