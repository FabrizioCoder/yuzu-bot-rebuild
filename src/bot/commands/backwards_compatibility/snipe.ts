import type { Command } from "../../types/command.ts";
import type { Embed } from "discordeno";
import { cache, Category, randomHex } from "utils";
import { avatarURL, getUser } from "discordeno";

export default <Command<false>> {
  options: {
    isGuildOnly: false,
    isAdminOnly: false,
    information: {
      descr: "Busca el último mensaje eliminado en el canal",
      short: "Busca mensajes eliminados",
    },
  },
  category: Category.Util,
  data: {
    name: "snipe",
  },
  async execute(bot, m) {
    const message = cache.lastMessages.get(m.channelId);

    if (!message) {
      return "No existe un mensaje eliminado";
    }

    const author = bot.users.get(message.authorId) ?? await getUser(bot, message.authorId);

    if (!author) return;

    if (message.content.length >= 4096) return;

    return <Embed> {
      author: {
        name: `${author.username}#${author.discriminator}`,
        iconUrl: avatarURL(bot, author.id, author.discriminator, {
          avatar: author.avatar,
          size: 512,
        }),
      },
      color: randomHex(),
      description: message.content,
      footer: {
        text: `${message.id} • ${new Date(message.timestamp).toLocaleString()}`,
      },
    };
  },
};
