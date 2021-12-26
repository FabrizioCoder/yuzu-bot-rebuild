import type { Command } from "../../types/command.ts";
import type { Embed } from "discordeno";
import { cache, Category, randomHex } from "../../../utils/mod.ts";
import { avatarURL } from "discordeno";

export default <Command> {
  options: {
    guildOnly: false,
    information: {
      descr: "Busca el último mensaje eliminado en el canal",
      short: "Busca mensajes eliminados",
    },
  },
  category: Category.Util,
  data: {
    name: "snipe",
    description: "Busca el último mensaje eliminado en el canal",
  },
  async execute(bot, interaction) {
    const message = cache.lastMessages.get(interaction.channelId!);

    if (!message) {
      return "No existe un mensaje eliminado";
    }

    if (message.content.length >= 4096) return;

    return <Embed> {
      author: {
        name: `${interaction.user.username}#${interaction.user.discriminator}`,
        iconUrl: avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
          avatar: interaction.user.avatar,
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
