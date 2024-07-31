const Discord = require("discord.js");
const Config = require('../../Config.json');

const CategoriesList = [Config.Ticket.Categoria];

module.exports = {
  name: "ticket-clear", 
  description: "🟢 Administração", 
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
      new Discord.EmbedBuilder()
      .setColor(Config.Cores.CorErro)
      .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
  ], ephemeral: true,});

  if(CategoriesList.includes(interaction.channel.parentId)){

    interaction.channel.messages.fetch({ limit: 100 }).then(messages => {
        const filterMessageBot = messages.filter(message => !message.author.bot);
        interaction.channel.bulkDelete(filterMessageBot);
    })

    interaction.reply({embeds: [
        new Discord.EmbedBuilder()
        .setDescription(`${Config.Emojis.Correto} **Ticket limpo por \`@${interaction.user.username}\`.**`)
        .setColor(Config.Cores.CorSucesso)]})

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