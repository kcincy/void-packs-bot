const Discord = require('discord.js');
const Config = require('./Config.json');
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildPresences
    ]
});

const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
	console.log('Erro em:', promise, 'razão:', reason);
});

module.exports = client;

client.on('ready', () => {
  console.log(`🟢 ONLINE EM: ${client.user.username} (${client.user.id})`)
  client.user.setPresence({ status: 'dnd' });

  let activities = ['🌌 Void Packs Soars', '🌈 Illuminate with Void Packs.', '🌠 Void Pack is High'], i = 0;
  setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, {type: 4}), 10 * 1000);
});

client.on('interactionCreate', (interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.reply(`Error`);
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction)
    };
});

client.slashCommands = new Discord.Collection();
require('./handler')(client);
client.login(Config.Tokens.token_discord);