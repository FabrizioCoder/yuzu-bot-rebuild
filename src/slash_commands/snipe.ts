import type { Command } from "../types/command.ts";
import type { Embed } from "../../deps.ts";
import { cache, Division } from "../utils/mod.ts";
import { avatarURL } from "../../deps.ts";

export default <Command> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Busca el último mensaje eliminado en el canal",
      short: "Busca mensajes eliminados",
    },
  },
  disabled: true,
  division: Division.INFO,
  data: {
    name: "snipe",
    description: "Busca el último mensaje eliminado en el canal",
  },
  async execute(bot, interaction) {
    const lastMessage = cache.lastMessages.first();

    if (!lastMessage) return "No existe un mensaje eliminado";

    // if (
    //   (
    //     Number(interaction.member?.permissions) &
    //     Number(BitwisePermissionFlags.MANAGE_MESSAGES)
    //   ) ===
    //     Number(BitwisePermissionFlags.MANAGE_MESSAGES)
    // ) {
    //   return "Debido a que el comando es invasivo se requiren permisos";
    // }

    if (lastMessage.content.length < 2000) {
      return <Embed> {
        author: {
          name:
            `${interaction.user.username}#${interaction.user.discriminator}`,
          iconURL: avatarURL(
            bot,
            interaction.user.id,
            interaction.user.discriminator,
            {
              avatar: interaction.user.avatar,
              size: 512,
            },
          ),
        },
        description: lastMessage.content,
      };
    }
  },
};
