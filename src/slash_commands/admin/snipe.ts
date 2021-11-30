import type { Command } from "../../types/command.ts";
import type { Embed } from "../../../deps.ts";
import { cache, Division, randomHex } from "../../utils/mod.ts";
import { avatarURL } from "../../../deps.ts";

export default <Command> {
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
    description: "Busca el último mensaje eliminado en el canal",
  },
  async execute(bot, interaction) {
    const message = cache.lastMessages.first();

    if (!message) {
      return "No existe un mensaje eliminado";
    }

    if (message.content.length < 4096 - 1) {
      return <Embed> {
        author: {
          name:
            `${interaction.user.username}#${interaction.user.discriminator}`,
          iconUrl: avatarURL(
            bot,
            interaction.user.id,
            interaction.user.discriminator,
            {
              avatar: interaction.user.avatar,
              size: 512,
            },
          ),
        },
        color: randomHex(),
        description: message.content,
        footer: {
          text: `${message.id} • ${
            new Date(message.timestamp).toLocaleString("es")
          }`,
        },
      };
    }
  },
};
