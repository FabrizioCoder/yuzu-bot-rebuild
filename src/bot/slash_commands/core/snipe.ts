import { createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { cache, Category, randomHex } from "utils";
import { avatarURL, sendMessage } from "discordeno";

createCommand({
  meta: {
    descr: "Busca el último mensaje eliminado en el canal",
    short: "Busca mensajes eliminados",
  },
  category: Category.Util,
  async execute({ bot, interaction }) {
    if (!interaction.channelId) return;

    const message = cache.lastMessages.get(interaction.channelId);

    if (!message) {
      return "No existe un mensaje eliminado";
    }

    if (message.content.length >= 4096) {
      const file = new Blob([message.content]);

      await sendMessage(bot, interaction.channelId, { file: [{ name: "Content.txt", blob: file }] });

      return "Mensaje largo recibido!";
    }

    const { embed } = new MessageEmbed()
      .author(
        message.tag,
        avatarURL(bot, interaction.user.id, interaction.user.discriminator, { avatar: interaction.user.avatar })
      )
      .color(randomHex())
      .description(message.content)
      .footer(`${message.id} • ${new Date(message.timestamp).toLocaleString()}`);

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("snipe")
    .setDescription("Busca el último mensaje eliminado en el canal")
    .toJSON(),
});
