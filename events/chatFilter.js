const { getGptResponse } = require('../utils/gpt');
const kataKasar = require('../utils/kataKasar');

const conversationHistory = new Map();

async function runChatFilter(message) {
    const content = message.content.toLowerCase();
    const found = kataKasar.find(word => content.includes(word));

    if (found) {
        try {
            await message.delete();

            await message.channel.send({
                content: `🚫 Haii <@${message.author.id}>~ Pesanmu mengandung kata yang tidak sopan dan sudah aku hapus yaa~ 💢 Tolong dijaga bahasanya, biar semua nyaman~ 🌸`,
                allowedMentions: { users: [message.author.id] }
            });

            try {
                await message.author.send(
                    `⚠️ Hai kak ${message.author.username}~\nPesanmu barusan dihapus karena mengandung kata tidak pantas: **${found}**.\n` +
                    `Yuk kita jaga suasana server tetap ramah dan positif yaa~ ✨`
                );
            } catch (err) {
                console.warn('📭 Gagal mengirim DM ke pengguna.');
            }
            return true; 
        } catch (err) {
            console.error('❌ Gagal menghapus pesan:', err);
            return false;
        }
    }
    return false;
}

async function handleMessageCreate(client, message) {
    if (message.author.bot) return;

    const messageWasDeleted = await runChatFilter(message);

    if (messageWasDeleted) {
        return;
    }

    try {
        await message.channel.sendTyping();

        const history = conversationHistory.get(message.channel.id) || [];
        history.push({ role: 'user', content: message.content });

        if (history.length > 10) history.shift();

        const gptResponse = await getGptResponse(history);

        if (gptResponse) {
            history.push({ role: 'assistant', content: gptResponse });
            conversationHistory.set(message.channel.id, history);
            await message.reply(gptResponse);
        }
    } catch (error) {
        message.reply('Oops, terjadi kesalahan saat saya mencoba membalas.');
    }
}

module.exports = { handleMessageCreate };