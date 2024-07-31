const Discord = require("discord.js");
const Transcript = require('discord-html-transcripts');
const moment = require("moment-timezone");
const Config = require('../../Config.json');

module.exports = {
  name: "ticket-delete", 
  description: "🟢 Administração", 
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
      new Discord.EmbedBuilder()
      .setColor(Config.Cores.CorErro)
      .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
  ], ephemeral: true,});

    const CategoriesList = [Config.Ticket.Categoria];
    const CanalLogTickets = interaction.guild.channels.cache.get(Config.CanaisID.CanalLogTickets);

    if(CategoriesList.includes(interaction.channel.parentId)){

        interaction.reply(`${Config.Emojis.Loading} **Deletando Ticket**`)

        let userID = interaction.channel.name.match(/\d+/g)[0]
        const TicketCriado = Discord.time(interaction.channel.createdAt, 'f');
        const TicketFechado = `<t:${moment().tz("America/Sao_Paulo").unix()}:f>`

        try {
          const Member = await interaction.guild.members.fetch(userID);
          UsuarioUsername = Member.user.username;
          UsuarioUser = Member.user;
          UsuarioID = Member.id;
        } catch (err) {
          UsuarioUsername = 'Inválido';
          UsuarioUser = 'Inválido';
          UsuarioID = 'Inválido';
        }

        const EmbedLogTicket = new Discord.EmbedBuilder()
        .setColor(Config.Cores.CorSucesso)
        .setDescription(`${Config.Emojis.CaixaComCarta} \`Ticket Logs >\` ✓ Ticket encerrado com sucesso.\n${Config.Emojis.Relogio} \`Ticket Aberto em >\` ${TicketCriado}\n${Config.Emojis.Relogio} \`Ticket Fechado em >\` ${TicketFechado}\n${Config.Emojis.Pessoa} \`Ticket Aberto por >\` ${UsuarioUser} | ${UsuarioUsername} | ${UsuarioID}\n${Config.Emojis.Cadeado} \`Ticket Fechado por >\` ${interaction.user} | ${interaction.user.id}`)
        

        const attachment = await Transcript.createTranscript(interaction.channel, {
            filename: `${UsuarioUsername}-${moment().tz("America/Sao_Paulo").format("DD-MM-YYYY-HH-mm-ss")}.html`
        });

        CanalLogTickets.send({embeds: [EmbedLogTicket], files: [attachment]});

        await interaction.channel.delete()
    }
    else{
        interaction.reply({embeds: [
            new Discord.EmbedBuilder()
            .setColor(Config.Cores.CorErro)
            .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado na categoria de tickets.**`)
        ], ephemeral: true,});
    }

  }
}