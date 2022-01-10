import { createMessageCommand, MessageEmbed } from "oasis";
import { cache, Category, randomHex } from "utils";
import { avatarURL, sendMessage, getUser } from "discordeno";

export default createMessageCommand({
  name: "snipe",
  category: Category.Util,
  meta: {
    descr: "Busca el último mensaje eliminado en el canal",
    short: "Busca mensajes eliminados",
  },
  async execute({ bot, message }) {
    const sniped = cache.lastMessages.get(message.channelId);

    if (!sniped) {
      return "No existe un mensaje eliminado";
    }

    if (sniped.content.length >= 4096) {
      const file = new Blob([sniped.content]);

      await sendMessage(bot, message.channelId, { file: [{ name: "Content.txt", blob: file }] });

      return "Mensaje largo recibido!";
    }

    const author = bot.users.get(message.authorId) ?? await getUser(bot, message.authorId);

    const { embed } = new MessageEmbed()
      .author(message.tag, avatarURL(bot, author.id, author.discriminator, { avatar: author.avatar }))
      .color(randomHex())
      .description(message.content)
      .footer(`${message.id} • ${new Date(message.timestamp).toLocaleString()}`);

    return embed;
  },
});
