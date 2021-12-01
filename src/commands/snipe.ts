import type { Command } from "../types/command.ts";
import type { DiscordenoUser, Embed } from "../../deps.ts";
import { cache, Division, randomHex } from "../utils/mod.ts";
import { avatarURL } from "../../deps.ts";

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
  async execute(bot) {
    const lastMessage = cache.lastMessages.first();

    if (!lastMessage) {
      return "No existe un mensaje eliminado";
    }

    const author = <DiscordenoUser | undefined> bot.cache.users.get(
      lastMessage.authorId,
    );

    if (!author) return;

    if (lastMessage.content.length < 4096 - 1) {
      return <Embed> {
        author: {
          name: `${author.username}#${author.discriminator}`,
          iconUrl: avatarURL(
            bot,
            author.id,
            author.discriminator,
            {
              avatar: author.avatar,
              size: 512,
            },
          ),
        },
        color: randomHex(),
        description: lastMessage.content,
        footer: {
          text: `${lastMessage.id} • ${
            new Date(lastMessage.timestamp).toLocaleString("es")
          }`,
        },
      };
    }
  },
};
