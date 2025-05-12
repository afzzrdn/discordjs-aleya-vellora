require('dotenv').config();
const { 
  CLIENT_ID, GUILD_ID
} = require('./config/ids');
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    // Ping
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping bot'),
    // AFK
    new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Memindahkanmu ke voice channel AFK'),
    // Owner
    new SlashCommandBuilder()
        .setName('owner')
        .setDescription('Informasi tentang pembuat bot'),
    // Warn
    new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Berikan peringatan kepada pengguna.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Pengguna yang ingin diperingatkan.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Alasan peringatan.')
                .setRequired(false)
        ),
    // Ban
    new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banned pengguna dari server.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('Pengguna yang ingin dibanned.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Alasan banned.')
            .setRequired(true)
        ),
    // Unban
    new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Membatalkan ban pengguna di server.')
        .addStringOption(option =>
            option.setName('user_id')
            .setDescription('ID pengguna yang ingin di-unban.')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Alasan unban.')
            .setRequired(false)
    ),
    // Help
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Menampilkan daftar perintah')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🧹 Menghapus semua slash command lama...');
        await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: [] },
        );
        console.log('✅ Semua perintah lama dihapus.');

        console.log('⏳ Mendaftarkan ulang perintah baru...');
        await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands },
        );
        console.log('✅ Perintah baru berhasil didaftarkan.');
    } catch (error) {
        console.error('❌ Terjadi kesalahan:', error);
    }
})();