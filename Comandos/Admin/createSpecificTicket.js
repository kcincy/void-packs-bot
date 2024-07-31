const Discord = require("discord.js");
const Config = require('../../Config.json');

const CategoriesList = [Config.Ticket.Categoria];

module.exports = {
  name: "ticket-create", 
  description: "🟢 Administração", 
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "usuário",
      description: "Selecione um usuário.",
      type: Discord.ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  run: async (client, interaction) => {

    const Usuario = interaction.options.getUser('usuário')

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
      new Discord.EmbedBuilder()
      .setColor(Config.Cores.CorErro)
      .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
  ], ephemeral: true,});

    const WelcomeMensagem = new Discord.EmbedBuilder()
    .setColor(Config.Cores.CorEmbed)
    .setDescription(`## ${Config.Emojis.Estrela} Forma de Pagamento:\n\n- **Primeiro Passo:** Abra a nossa página do LivePix, clicando aqui: [livepix.gg/ycnick](https://livepix.gg/ycnick).\n- **Segundo Passo:** Gere um Pix no site. Os campos "Nome" e "Mensagem" são opcionais e não têm importância.\n- **Terceiro Passo:** Copie a chave ou escaneie o código QR gerado.\n- **Quarto Passo:** Efetue o pagamento do Pix. Em seguida envie o comprovante neste ticket e aguarde a resposta de algum administrador.`)

    const FecharEmbed = new Discord.EmbedBuilder()
    .setColor(Config.Cores.CorEmbed)
    .setDescription(`**Para encerrar este ticket, reaja com ${Config.Emojis.Cadeado}.**`);

    let Ticket = await interaction.guild.channels.create({
        name: `🛒・carrinho-${Usuario.id}`, type: Discord.ChannelType.GuildText,
        parent: Config.Ticket.Categoria,
        permissionOverwrites: [
            { id: interaction.guildId, deny: [Discord.PermissionFlagsBits.ViewChannel] },
            { id: Usuario.id, allow: [Discord.PermissionFlagsBits.ViewChannel] },
        ]
    })

    interaction.reply({embeds: [
        new Discord.EmbedBuilder()
        .setDescription(`${Config.Emojis.Correto} **Seu ticket foi aberto com sucesso!** Clique no botão para ser redirecionado ao canal.`)
        .setColor(Config.Cores.CorEmbed)
    ], components: [
        new Discord.ActionRowBuilder()
        .addComponents(
        new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Link)
        .setLabel(`Ticket`)
        .setEmoji('1169850614562435072')
        .setURL(Ticket.url), 
    )], ephemeral: true})

    Ticket.send({content: `**Olá ${interaction.user}! Seja bem-vindo(a) ao seu carrinho VIP.** Para concluir a compra, basta acompanhar os passos indicados abaixo.`, embeds: [WelcomeMensagem, FecharEmbed], components: [
      new Discord.ActionRowBuilder()
      .addComponents(
      new Discord.ButtonBuilder()
      .setLabel(`Fechar Ticket`)
      .setStyle(Discord.ButtonStyle.Secondary)
      .setCustomId('fecharticket')
      .setEmoji('1171996448817156107')
      )]})
}
}