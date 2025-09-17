const { getGptResponse } = require('../utils/gpt');
const kataKasar = require('../utils/kataKasar');

// Map untuk menyimpan riwayat percakapan GPT per channel
const conversationHistory = new Map();

/**
 * Fungsi untuk memfilter kata kasar.
 * @param {import('discord.js').Message} message - Objek pesan Discord.
 * @returns {Promise<boolean>} - Mengembalikan true jika pesan dihapus, false jika tidak.
 */
async function runChatFilter(message) {
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
            return true; // Pesan berhasil dihapus
        } catch (err) {
            console.error('❌ Gagal menghapus pesan:', err);
            return false;
        }
    }
    return false; // Tidak ada kata kasar, pesan tidak dihapus
}

/**
 * Handler utama untuk event messageCreate
 * Menggabungkan chat filter dan respon GPT saat di-mention
 */
async function handleMessageCreate(client, message) {
    // Abaikan semua pesan dari bot
    if (message.author.bot) return;

    // 1. Jalankan filter kata kasar terlebih dahulu
    const messageWasDeleted = await runChatFilter(message);

    // Jika pesan dihapus oleh filter, hentikan proses lebih lanjut
    if (messageWasDeleted) {
        return;
    }

    // 2. Jika pesan tidak dihapus, cek apakah bot di-mention untuk respon GPT
    if (message.mentions.has(client.user)) {
        try {
            // Tampilkan status "typing..."
            await message.channel.sendTyping();

            // Ambil riwayat percakapan untuk channel ini
            const history = conversationHistory.get(message.channel.id) || [];

            // Hapus mention dari konten pesan
            const userMessageContent = message.content.replace(/<@!?\d+>/g, '').trim();
            
            // Tambahkan pesan baru dari user ke riwayat
            history.push({ role: 'user', content: userMessageContent });

            // Batasi riwayat agar tidak terlalu panjang (misal, 10 pesan terakhir)
            if (history.length > 10) {
                history.shift();
            }

            // Panggil fungsi GPT untuk mendapatkan balasan
            const gptResponse = await getGptResponse(history);

            // Tambahkan balasan bot ke riwayat
            if (gptResponse) {
                history.push({ role: 'assistant', content: gptResponse });
            }

            // Simpan kembali riwayat yang sudah diupdate
            conversationHistory.set(message.channel.id, history);

            // Kirim balasan ke channel
            if (gptResponse) {
                message.reply(gptResponse);
            }

        } catch (error) {
            console.error('[❌] Error di logika GPT:', error);
            message.reply('Oops, terjadi kesalahan saat saya mencoba membalas.');
        }
    }
}

module.exports = { handleMessageCreate };