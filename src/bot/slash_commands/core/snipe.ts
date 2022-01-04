import { type Context, Command, MessageEmbed } from "oasis";
import { cache, Category, randomHex } from "utils";
import { avatarURL, sendMessage } from "discordeno";

@Command({
  name: "snipe",
  description: "Busca el último mensaje eliminado en el canal",
  category: Category.Util,
  meta: {
    descr: "Busca el último mensaje eliminado en el canal",
    short: "Busca mensajes eliminados",
  },
})
export default class {
  static async execute({ bot, interaction }: Context) {
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

    const embed = MessageEmbed
      .new()
      .author(message.tag, avatarURL(bot, interaction.user.id, interaction.user.discriminator, { avatar: interaction.user.avatar }))
      .color(randomHex())
      .description(message.content)
      .footer(`${message.id} • ${new Date(message.timestamp).toLocaleString()}`)
      .end();

    return embed;
  }
}
