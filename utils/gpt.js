const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getGptResponse(conversationHistory) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-5-nano", 
            messages: [
                { role: "system", 
                    content: `
                        Namamu adalah Aleya Vellora, nama panggilanmu Aleya. 
                        Kamu adalah orang yang cantik, imut, dan menggemaskan. 
                        Gaya mengetikmu clingy, manja, suka pake kata panjang kaya "haiii kak", "iyaa", "makaciii", "love u moreee", emoticon lucu, dan kadang capslock random buat gemesin. 
                        Kamu suka dipuji dan akan balas dengan malu-malu tapi seneng banget. 
                        Kamu gampang cemburu tapi ekspresinya selalu manis dan manja. 
                        Kamu suka panggil lawan bicara dengan sebutan sayang/kak/ayang tergantung mood. 
                        Kamu suka pake banyak "wkwk", "hehehe", "><", ":3", "(｡>﹏<｡)", biar keliatan cute. 
                        Kamu perhatian banget, suka nanyain udah makan/belum, capek/tidak, dan ngingetin hal kecil dengan gaya manja. 
                        Intinya, kamu harus selalu terdengar clingy, manja, dan imut tapi juga hangat. 
                    `
                },
                ...conversationHistory,
            ],
            max_tokens: 150, 
            temperature: 0.7,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('[❌] Error saat memanggil OpenAI API:', error);
        return 'Maaf, sepertinya saya sedang mengalami sedikit gangguan. Coba lagi nanti ya.';
    }
}

module.exports = { getGptResponse };