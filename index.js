    const express = require("express");
    const app = express();

    app.get("/", (req, res) => {
      res.send("Bot online!");
    });

    app.listen(3000, () => {
      console.log("Servidor web ligado!");
    });

    const {
      Client,
      GatewayIntentBits,
      ActionRowBuilder,
      ButtonBuilder,
      ButtonStyle,
      ModalBuilder,
      TextInputBuilder,
      TextInputStyle,
      EmbedBuilder,
    } = require("discord.js");

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    client.once("ready", () => {
      console.log(`Bot ligado como ${client.user.tag}`);
    });

    // 🔥 COMANDO !tag (COM PROTEÇÃO)
    client.on("messageCreate", async (message) => {
      if (message.author.bot) return;

      if (message.content === "!tag") {

        // 🔒 CANAL
        if (message.channel.name !== "🚀・pedir-set-fac") {
          return message.reply("❌ Use no canal correto.");
        }

        // 🔒 CARGOS
        const cargosPermitidos = ["LIDER", "SUB-LIDER", "GERENTE GERAL"];

        const temPermissao = message.member.roles.cache.some(role =>
          cargosPermitidos.includes(role.name)
        );

        if (!temPermissao) {
          return message.reply("❌ Sem permissão.");
        }

        const embed = new EmbedBuilder()
          .setColor("#2b2d31")
          .setTitle("⚔️ CARTEL")
          .setDescription(
            "Seja bem-vindo ao nosso sistema!\n\n" +
            "**Antes de dar sequência, precisamos do seguinte dado:**\n\n" +
            "• NOME (Nome que você colocou no RP.)\n\n" +
            "• ID (você recebe ao entrar no servidor.)\n\n" +
            "**Clique em Estou Pronto abaixo**"
          );

        const botao = new ButtonBuilder()
          .setCustomId("abrir_modal")
          .setLabel("Estou Pronto!")
          .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(botao);

        message.channel.send({
          embeds: [embed],
          components: [row],
        });
      }
    });

    // 🔥 INTERAÇÕES (MODAL)
    client.on("interactionCreate", async (interaction) => {

      if (interaction.isButton()) {
        const modal = new ModalBuilder()
          .setCustomId("formulario")
          .setTitle("Liberação");

        const nomeInput = new TextInputBuilder()
          .setCustomId("nome")
          .setLabel("NOME COMPLETO DO RP:")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        const idInput = new TextInputBuilder()
          .setCustomId("id")
          .setLabel("ID:")
          .setStyle(TextInputStyle.Short)
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(nomeInput),
          new ActionRowBuilder().addComponents(idInput),
        );

        await interaction.showModal(modal);
      }

      if (interaction.isModalSubmit()) {
        const nome = interaction.fields.getTextInputValue("nome");
        const id = interaction.fields.getTextInputValue("id");

        const novoNome = `${id} / ${nome}`;
        const member = interaction.member;

        await member.setNickname(novoNome).catch(() => {});

        const cargo = interaction.guild.roles.cache.find(
          (r) => r.name === "RESIDENTE IMERSON"
        );

        if (cargo) {
          await member.roles.add(cargo).catch(() => {});
        }

        await interaction.reply({
          content: `✅ Nome definido: ${novoNome}`,
          ephemeral: true,
        });
      }
    });

   client.login(process.env.TOKEN);