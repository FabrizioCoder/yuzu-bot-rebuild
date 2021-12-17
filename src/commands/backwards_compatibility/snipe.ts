import type { Command } from "../../types/command.ts";
import type { Embed } from "../../../deps.ts";
import { cache, Division, randomHex } from "../../utils/mod.ts";
import { avatarURL, getUser } from "../../../deps.ts";

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Busca el último mensaje eliminado en el canal",
      short: "Busca mensajes eliminados",
    },
  },
  division: Division.UTIL,
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
