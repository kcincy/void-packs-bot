const Discord = require("discord.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require("axios");
const moment = require("moment-timezone");
const Config = require('../../Config.json');

module.exports = {
  name: "publicar",
  description: "🟢 Administração",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "Canal onde a publicação será enviada.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "título",
      description: "Título da publicação.",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "link",
      description: "Link do conteúdo da publicação.",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "imagem",
      description: "Imagem da publicação.",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: async (client, interaction) => {
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
                new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorErro)
                .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
            ], ephemeral: true,});

    interaction.reply({content: `${Config.Emojis.Loading} \`Processando.\``, ephemeral: true})

    const CanalInput = interaction.options.getChannel("canal");
    const TituloInput = interaction.options.getString("título");
    const ImagemInput = interaction.options.getString("imagem");
    const LinkInput = interaction.options.getString("link");

    const CanalLogEncurtador = interaction.guild.channels.cache.get(Config.CanaisID.CanalLogEncurtador);
    const CanalLogPostagens = interaction.guild.channels.cache.get(Config.CanaisID.CanalLogPostagens);
    const CanalVip = interaction.guild.channels.cache.get(Config.CanaisID.CanalVip);

    const MomentData = moment().format("DD/MM/YYYY");
    const MomentHora = moment().tz("America/Sao_Paulo").format("HH:mm:ss");

    const ListaEmojis = [Config.Emojis.Fogo, Config.Emojis.Laco, Config.Emojis.MaisDezoito, Config.Emojis.Demonio];
    const EmojiAleatorio = ListaEmojis[Math.floor(Math.random() * ListaEmojis.length)];

    const apiKey1VOID = Config.ApiKeys.apiKeyShrtFlyVOID;
    const apiKey2VOID = Config.ApiKeys.apiKeyLinkSlyVOID;

    axios.get(`https://shrtfly.com/api?api=${apiKey1VOID}&url=${LinkInput}`)
    .then((reponse1) => {
    if (reponse1.data.status === "error") {
    interaction.editReply(`${Config.Emojis.ErroBot} \`Erro ao encurtar na API do ShrtFly\``)

    const EmbedShrtFlyErro = new EmbedBuilder()
    .setColor(Config.Cores.CorErro)
    .setDescription(`${Config.Emojis.ShrtFly} \`ShrtFly API Logs >\` ✕ Erro ao encurtar o link.\n${Config.Emojis.Lupa} \`Link Encurtado >\` Indefinido.\n${Config.Emojis.ID} \`Identificador >\` [${TituloInput}](${LinkInput})`)

    CanalLogEncurtador.send({embeds: [EmbedShrtFlyErro], flags: [ 4096 ]})
    } 
    if (reponse1.data.status === "success") {
    const Link1EncurtadoVOID = reponse1.data.result.shorten_url;

    const EmbedShrtFlySucesso = new EmbedBuilder()
    .setColor(Config.Cores.CorSucesso)
    .setDescription(`${Config.Emojis.ShrtFly} \`ShrtFly API Logs >\` ✓ Link encurtado com sucesso.\n${Config.Emojis.Lupa} \`Link Encurtado >\` <${Link1EncurtadoVOID}>\n${Config.Emojis.ID} \`Identificador >\` [${TituloInput}](${LinkInput})`)

    CanalLogEncurtador.send({embeds: [EmbedShrtFlySucesso], flags: [ 4096 ]})

    axios.get(`https://linksly.co/api?api=${apiKey2VOID}&url=${Link1EncurtadoVOID}`)
    .then((reponse2) => {
    if (reponse2.data.status === "error") {
    interaction.editReply(`${Config.Emojis.ErroBot} \`Erro ao encurtar na API do LinkSly\``)

    const EmbedLinkSlyErro = new EmbedBuilder()
    .setColor(Config.Cores.CorErro)
    .setDescription(`${Config.Emojis.LinkSly} \`Linksly API Logs >\` ✕ Erro ao encurtar o link.\n${Config.Emojis.Lupa} \`Link Encurtado >\` Indefinido.\n${config.emojis.ID} \`Identificador >\` [${TituloInput}](${LinkInput})`)

    CanalLogEncurtador.send({embeds: [EmbedLinkSlyErro], flags: [ 4096 ]})
    } 
    if (reponse2.data.status === "success") {
        const Link2EncurtadoVOID = reponse2.data.shortenedUrl;
        interaction.editReply(`${Config.Emojis.Loading} \`Sucesso ao encurtar o link.\``)

        const EmbedLinkSlySucesso = new EmbedBuilder()
        .setColor(Config.Cores.CorSucesso)
        .setDescription(`${Config.Emojis.LinkSly} \`Linksly API Logs >\` ✓ Link encurtado com sucesso.\n${Config.Emojis.Lupa} \`Link Encurtado >\` <${Link2EncurtadoVOID}>\n<:IdButton:1184741783670886521> \`Identificador >\` [${TituloInput}](${LinkInput})`)

        CanalLogEncurtador.send({embeds: [EmbedLinkSlySucesso], flags: [ 4096 ]})

        const EmbedLogPostagem = new EmbedBuilder()
        .setColor(Config.Cores.CorSucesso)
        .setDescription(`${Config.Emojis.Pessoa} \`Postado por >\` <@${interaction.user.id}> | ${interaction.user.id}\n${Config.Emojis.Lapis} \`Título >\` ${TituloInput}\n${Config.Emojis.Pasta} \`Postado em >\` ${CanalInput.name}\n${Config.Emojis.Globo} \`\Link sem AD >\` ${LinkInput}\n${Config.Emojis.ShrtFly} \`Link Encurtado [ShrtFly] >\` ${Link1EncurtadoVOID}\n${Config.Emojis.LinkSly} \`Link Encurtado [Linksly] >\` ${Link2EncurtadoVOID}\n${Config.Emojis.Quadro} \`Link da Imagem >\` [Clique aqui](${ImagemInput})`)
        .setFooter({text: `${MomentData} ・ ${MomentHora}`, iconURL: 'https://i.imgur.com/9EmD97L.png'})

        CanalLogPostagens.send({embeds: [EmbedLogPostagem], flags: [ 4096 ]})

        const ListaCores = ["#FF0931", "#FF2FB3", "#8C0BFF", "#FFF227", "#00C0F9", "#00FDCC"];
        const CorAleatorio = ListaCores[Math.floor(Math.random() * ListaCores.length)];
        const EmbedVIP = new EmbedBuilder()
        .setColor(CorAleatorio)
        .setDescription(`<:Paperclip:1169850614562435072> **${TituloInput}**: ${LinkInput}`)

        CanalVip.send({embeds: [EmbedVIP]})

        const EmbedPrincipal = new EmbedBuilder()
        .setColor(Config.Cores.CorEmbed)
        .setDescription(`## ${EmojiAleatorio} ${TituloInput}\n## ${Config.Emojis.Clipe} ${Link2EncurtadoVOID}\n ## ${Config.Emojis.Estrela} ${Config.Textos.TextoVip}.`)
        .setImage(ImagemInput)

        const BotaoPrincipal = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setLabel(`🛒・Adquirir o VIP`)
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.com/channels/1169759191548833842/1169761966001238016")
        );

        CanalInput.send({embeds: [EmbedPrincipal], components: [BotaoPrincipal]})
        .then(() => interaction.editReply(`${Config.Emojis.AcertoBot} \`Postagem enviada com êxito.\``)).catch(() => interaction.editReply(`${Config.Emojis.ErroBot} \`Falha ao enviar a postagem para o Discord.\``));
    }})}});

    /*switch(CanalInput.id){
      case Config.CanaisID.CanalPacks:
        new Discord.WebhookClient({ url: Config.Webhooks.WebHookPacksVOID }).send({
          content: 'Pack.'
        });break;

      case Config.CanaisID.CanalPorno:
        new Discord.WebhookClient({ url: Config.Webhooks.WebHookPornoVOID }).send({
          content: 'Porno.'
        });break;
          
      case Config.CanaisID.CanalTufos:
        new Discord.WebhookClient({ url: Config.Webhooks.WebHookTufosVOID }).send({
          content: 'Tufos.'
        });break;

      case Config.CanaisID.CanalVazados:
        new Discord.WebhookClient({ url: Config.Webhooks.WebHookVazadosVOID }).send({
          content: 'Vazados.'
      });break;
    }*/
    
  }};