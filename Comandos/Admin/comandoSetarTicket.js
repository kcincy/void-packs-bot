const Discord = require('discord.js');
const Config = require('../../Config.json');

module.exports = {
    name: "setar-ticket",
    description: "🟢 Administração",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
          name: "canal",
          description: "Canal onde o ticket será enviado.",
          type: Discord.ApplicationCommandOptionType.Channel,
          required: true,
        },
    ],

    run: async (client, interaction) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
        new Discord.EmbedBuilder()
        .setColor(Config.Cores.CorErro)
        .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
    ], ephemeral: true,});

    const EmbedTicket = new Discord.EmbedBuilder()
    .setColor(Config.Cores.CorEmbed)
    .setDescription(Config.Textos.TextoVipVenda)
    .setImage("https://i.imgur.com/rLwLIfb.png")

    const BotaoTicket = new Discord.ActionRowBuilder()
    .addComponents(
      new Discord.ButtonBuilder()
      .setEmoji('1198016937431666859')
      .setLabel(`Adquirir o VIP`)
      .setStyle(Discord.ButtonStyle.Secondary)
      .setCustomId('abrirticket')
    );

    const CanalInput = interaction.options.getChannel("canal");

    CanalInput.send({embeds: [EmbedTicket], components: [BotaoTicket]})

    interaction.reply({ content: `${Config.Emojis.AcertoBot} \`Ticket enviado com êxito.\``, ephemeral: true });
    }
};