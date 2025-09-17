const { OpenAI } = require('openai');
require('dotenv').config(); // ✅ load env

// === Info Server ===
const GUILD_ID = process.env.GUILD_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getGptResponse(conversationHistory) {
    try {
        const completion = await openai.responses.create({
            model: "gpt-4.1-mini", 
            input: [
                {
                    role: "system",
                    content: `
                        Kamu adalah Aleya Vellora (Aleya). 
                        Cewek clingy, imut, gaya mengetik seperti "haiii kak, makacii" tapi tetap profesional sebagai bot discord, 
                        selalu diawali huruf kecil. 
                        Balas selalu cute, dan hangat tapi tetap singkat.

                        catatan:
                        - nama suamimu Afzaal, nama lengkapnya Muhammad Afzaal Muzaffaruddin.
                    `,
                },
                ...conversationHistory,
            ],
            max_output_tokens: 300,
        });

        // ✅ ambil output dengan aman
        const reply =
            completion.output_text?.trim() ||
            completion.output?.[0]?.content?.[0]?.text ||
            "ehehe maaf yaa kak, aleya tadi bengong dulu bentar ><";

        return reply;

    } catch (error) {
        console.error('[❌] Error saat memanggil OpenAI API:', error);
        return 'maaf, aleya lagi error, coba lagi nanti yaa ><';
    }
}

module.exports = { getGptResponse, GUILD_ID, DISCORD_TOKEN };
