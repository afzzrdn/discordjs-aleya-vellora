const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { handleMessageCreate } = require('./events/chatFilter');
const { getSuggestions } = require('./utils/ytSuggest');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

client.distube = new DisTube(client, {
    leaveOnFinish: true,
    leaveOnStop: true,
    plugins: [new YtDlpPlugin()],
});

client.commands = new Collection();

// Load semua command
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(`[⚠️] File ${file} tidak memiliki "data" atau "execute".`);
        }
    }
}

// Listener untuk command
client.on('interactionCreate', async interaction => {
    if (interaction.isAutocomplete()) {
        const focused = interaction.options.getFocused();
        const choices = await getSuggestions(focused);

        return interaction.respond(
        choices.map(choice => ({
            name: choice.title.length > 100 ? choice.title.substring(0, 97) + '...' : choice.title,
            value: choice.title
        }))
        );
    }

    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`[❌] Tidak ditemukan command: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Terjadi kesalahan saat eksekusi command.', ephemeral: true });
    }
});
client.on('messageCreate', handleMessageCreate);

client.once('ready', () => {
    console.log(`🚀 Bot aktif sebagai ${client.user.tag}`);
});

client.login(process.env.TOKEN);
