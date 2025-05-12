require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { CLIENT_ID, GUILD_ID } = require('./config/ids');

const commands = [];

// Loop semua folder di ./commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.warn(`[⚠️] File ${file} tidak memiliki "data" atau "execute".`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🧹 Menghapus semua slash command lama...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: [] }
        );
        console.log('✅ Semua perintah lama dihapus.');

        console.log('⏳ Mendaftarkan ulang perintah baru...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('✅ Semua perintah baru berhasil didaftarkan.');
    } catch (error) {
        console.error('❌ Terjadi kesalahan:', error);
    }
})();
