const Discord = require("discord.js");
const Config = require('../../Config.json');

module.exports = {
  name: "publicar-vip",
  description: "🟢 Administração",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
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
  ],

  run: async (client, interaction) => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
      new Discord.EmbedBuilder()
      .setColor(Config.Cores.CorErro)
      .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
  ], ephemeral: true,});

    const TituloInput = interaction.options.getString("título");
    const LinkInput = interaction.options.getString("link");

    const CanalVip = interaction.guild.channels.cache.get(Config.CanaisID.CanalVip);

    const ListaCores = ["#FF0931", "#FF2FB3", "#8C0BFF", "#FFF227", "#00C0F9", "#00FDCC"];
    const CorAleatorio = ListaCores[Math.floor(Math.random() * ListaCores.length)];

    const EmbedVIP = new Discord.EmbedBuilder()
    .setColor(CorAleatorio)
    .setDescription(`${Config.Emojis.Clipe} **${TituloInput}**: ${LinkInput}`)

    CanalVip.send({embeds: [EmbedVIP]});

    interaction.reply({ content: `${Config.Emojis.AcertoBot} \`Postagem enviada com êxito.\``, ephemeral: true });
  },
};
