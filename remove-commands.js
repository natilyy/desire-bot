const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.json'); // Add your bot token and client ID

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize the REST client
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started removing application (/) commands.');

        // Delete all global commands
        await rest.put(Routes.applicationCommands(clientId), { body: [] });

        console.log('Successfully removed all application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
