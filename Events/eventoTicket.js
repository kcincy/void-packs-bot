const Discord = require('discord.js');
const Client = require('../index');
const Transcript = require('discord-html-transcripts');
const moment = require("moment-timezone");
const Config = require('../Config.json');

Client.on("interactionCreate", async interaction => {

    const Categoria = Config.Ticket.Categoria;
    const CanalLogTickets = interaction.guild.channels.cache.get(Config.CanaisID.CanalLogTickets);

    const WelcomeEmbed = new Discord.EmbedBuilder()
    .setColor(Config.Cores.CorEmbed)
    .setDescription(`## ${Config.Emojis.Estrela} Forma de Pagamento:\n\n- **Primeiro Passo:** Abra a nossa página do LivePix, clicando aqui: [livepix.gg/ycnick](https://livepix.gg/ycnick).\n- **Segundo Passo:** Gere um Pix no site. Os campos "Nome" e "Mensagem" são opcionais e não têm importância.\n- **Terceiro Passo:** Copie a chave ou escaneie o código QR gerado.\n- **Quarto Passo:** Efetue o pagamento do Pix. Em seguida envie o comprovante neste ticket e aguarde a resposta de algum administrador.`)

    const FecharEmbed = new Discord.EmbedBuilder()
    .setColor(Config.Cores.CorEmbed)
    .setDescription(`**Para encerrar este ticket, reaja com ${Config.Emojis.Cadeado}.**`);

    const PainelAdminEmbed = new Discord.EmbedBuilder()
    .setDescription(`**Controles da equipe de Administração.**`)
    .setColor(Config.Cores.CorSucesso)

    const PainelAdmin = new Discord.ActionRowBuilder()
                .addComponents(
                  new Discord.ButtonBuilder()
                  .setLabel(`Reabrir Ticket`)
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setCustomId('reabrirticket')
                  .setEmoji('1171999847524597770')
                )
                .addComponents(
                  new Discord.ButtonBuilder()
                  .setLabel(`Deletar Ticket`)
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setCustomId('apagarticket')
                  .setEmoji('1171996450192887900')
                )
                .addComponents(
                  new Discord.ButtonBuilder()
                  .setLabel(`Marcar Ticket`)
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setCustomId('marcarticket')
                  .setEmoji('1197819803742781500')
                )

    if (interaction.isButton()) {
        if (interaction.customId === 'abrirticket') {
            let Ticket = await interaction.guild.channels.create({
                name: `🛒・carrinho-${interaction.user.id}`, type: Discord.ChannelType.GuildText,
                parent: Categoria,
                permissionOverwrites: [
                    { id: interaction.guildId, deny: [Discord.PermissionFlagsBits.ViewChannel] },
                    { id: interaction.user.id, allow: [Discord.PermissionFlagsBits.ViewChannel] },
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

            Ticket.send({content: `**Olá ${interaction.user}! Seja bem-vindo(a) ao seu carrinho VIP.** Para concluir a compra, basta acompanhar os passos indicados abaixo.`, embeds: [WelcomeEmbed, FecharEmbed], components: [
                new Discord.ActionRowBuilder()
                .addComponents(
                new Discord.ButtonBuilder()
                .setLabel(`Fechar Ticket`)
                .setStyle(Discord.ButtonStyle.Secondary)
                .setCustomId('fecharticket')
                .setEmoji('1171996448817156107')
                )]})
        }


        if (interaction.customId === 'fecharticket'){
            interaction.reply({embeds: [
                new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorSucesso)
                .setDescription('**Tem certeza que deseja fechar este ticket?**')
            ], components: [
                new Discord.ActionRowBuilder()
                .addComponents(
                  new Discord.ButtonBuilder()
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setCustomId('confirmado')
                  .setLabel('Confirmar')
                  .setEmoji('1171806254159626292')
                )
                .addComponents(
                  new Discord.ButtonBuilder()
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setCustomId('cancelado')
                  .setLabel('Cancelar')
                  .setEmoji('1182785938607308830')
                )]})
        }

        if (interaction.customId === 'cancelado'){
            interaction.message.delete()
        }

        if (interaction.customId === 'confirmado'){
            let userID = interaction.message.channel.name.match(/\d+/g)[0]

            interaction.guild.members.fetch(userID).then(member => {
                interaction.message.delete()
                interaction.channel.permissionOverwrites.edit(userID, { ViewChannel: false });
        
                interaction.channel.send({embeds: [
                    new Discord.EmbedBuilder()
                    .setDescription(`${Config.Emojis.Correto} **Ticket fechado por \`@${interaction.user.username}\`.**`)
                    .setColor(Config.Cores.CorSucesso), PainelAdminEmbed],
                    components: [PainelAdmin]})
            }).catch(error => {
                interaction.message.delete()

                interaction.channel.send({embeds: [
                    new Discord.EmbedBuilder()
                    .setDescription(`${Config.Emojis.Correto} **Ticket fechado por \`@${interaction.user.username}\`.**`)
                    .setColor(Config.Cores.CorSucesso), PainelAdminEmbed],
                    components: [PainelAdmin]})
            });
        }

        if (interaction.customId === 'reabrirticket'){
            let userID = interaction.message.channel.name.match(/\d+/g)[0]
            interaction.guild.members.fetch(userID).then(member => {
                interaction.message.delete()
                interaction.channel.permissionOverwrites.edit(userID, { ViewChannel: true });
        
                interaction.channel.send({embeds: [
                    new Discord.EmbedBuilder()
                    .setColor(Config.Cores.CorSucesso)
                    .setDescription(`${Config.Emojis.Correto} **Ticket reaberto por \`@${interaction.user.username}\`.**`)
                ]})
            }).catch(error => {
                interaction.message.delete()

                interaction.channel.send({embeds: [
                    new Discord.EmbedBuilder()
                    .setColor(Config.Cores.CorSucesso)
                    .setDescription(`${Config.Emojis.Correto} **Ticket reaberto por \`@${interaction.user.username}\`.**`)
                ]})
            });
        }

        if (interaction.customId === 'marcarticket'){
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
                new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorErro)
                .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
            ], ephemeral: true,});

            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({content: `${Config.Emojis.ErroBot} Opss ${interaction.user}! Este comando só pode ser usado por Administradores.`, ephemeral: true,});

            const CanalMarcardo = interaction.guild.channels.cache.get(interaction.channelId);
        
            const NomeMarcado = CanalMarcardo.name.replace('🛒', '🟢');
            interaction.guild.channels.cache.get(interaction.channelId).setName(NomeMarcado)

            interaction.reply({embeds: [
                new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorSucesso)
                .setDescription(`${Config.Emojis.Correto} **Ticket marcado por \`@${interaction.user.username}\`.**`)
            ]})
        }

        if (interaction.customId === 'apagarticket'){
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
                new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorErro)
                .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
            ], ephemeral: true,});

            const Data = new Date();
            Data.setSeconds(Data.getSeconds() + Config.Ticket.Timer);
            const relative = Discord.time(Data, 'R');

            interaction.channel.send({ embeds: [
                new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorErro)
                .setDescription(`**Este ticket será deletado ${relative}.**`)
            ], components: [
                new Discord.ActionRowBuilder()
                .addComponents(
                  new Discord.ButtonBuilder()
                  .setLabel(`Cancelar`)
                  .setStyle(Discord.ButtonStyle.Secondary)
                  .setCustomId('deletecancelado')
                  .setEmoji('1182785938607308830')
                )]})

            interaction.message.delete()

            deleteTimeout = setTimeout(async () => {
            try {
                let userID = interaction.message.channel.name.match(/\d+/g)[0]
                const TicketCriado = Discord.time(interaction.message.channel.createdAt, 'f');
                const TicketFechado = `<t:${moment().tz("America/Sao_Paulo").unix()}:f>`
                const Usuario = interaction.guild.members.cache.get(userID) ?? 'Inválido'
                
                let UsuarioUsername, UsuarioUser, UsuarioID;
                if (Usuario !== 'Inválido') {
                  UsuarioUsername = Usuario.user.username;
                  UsuarioUser = Usuario.user;
                  UsuarioID = Usuario.id;
                } else {
                  UsuarioUsername = 'Inválido';
                  UsuarioUser = 'Inválido';
                  UsuarioID = 'Inválido';
                }
                
                const EmbedLogTicket = new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorSucesso)
                .setDescription(`${Config.Emojis.CaixaComCarta} \`Ticket Logs >\` ✓ Ticket encerrado com sucesso.\n${Config.Emojis.Relogio} \`Ticket Aberto em >\` ${TicketCriado}\n${Config.Emojis.Relogio} \`Ticket Fechado em >\` ${TicketFechado}\n${Config.Emojis.Pessoa} \`Ticket Aberto por >\` ${UsuarioUser} | ${UsuarioUsername} | ${UsuarioID}\n${Config.Emojis.Cadeado} \`Ticket Fechado por >\` ${interaction.user} | ${interaction.user.id}`)
                

                const attachment = await Transcript.createTranscript(interaction.message.channel, {
                    filename: `${UsuarioUsername}-${moment().tz("America/Sao_Paulo").format("DD-MM-YYYY-HH-mm-ss")}.html`
                });

                CanalLogTickets.send({embeds: [EmbedLogTicket], files: [attachment]})

                await interaction.channel.delete()
            }
            catch (error) {
                return;
            }
            }, Config.Ticket.Timer * 1000);
            
        }

        if (interaction.customId === 'deletecancelado'){
            if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return interaction.reply({embeds: [
                new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorErro)
                .setDescription(`**Opss ${interaction.user}! Este comando só pode ser usado por Administradores.**`)
            ], ephemeral: true,});
            
            clearTimeout(deleteTimeout)
            interaction.message.delete()
            interaction.channel.send({embeds: [
                new Discord.EmbedBuilder()
                .setColor(Config.Cores.CorSucesso)
                .setDescription(`${Config.Emojis.Correto} **A exclusão do ticket foi interrompida por \`@${interaction.user.username}\`.**`), PainelAdminEmbed], components: [PainelAdmin]})
        }
    }
});


