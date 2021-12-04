import type { Command } from "../../types/command.ts";
import type { Embed } from "../../../deps.ts";
import { Division, randomHex } from "../../utils/mod.ts";
import { createEmoji, deleteEmoji, editEmoji } from "../../../deps.ts";

export default <Command<false>> {
  options: {
    guildOnly: true,
    adminOnly: false,
    information: {
      descr: "Muestra, añade y remueve emotes",
      usage: "emotes | add | remove | hide | display [name] [url]",
    },
  },
  division: Division.CONFIG,
  data: {
    name: "emotes",
  },
  async execute(bot, message, { args }) {
    const [option, ...options] = args;

    if (!message.guildId) return;

    const guild = bot.guilds.get(message.guildId);

    if (!guild) return;

    switch (option) {
      case "hide": {
        const [name, role] = options as [
          string | undefined,
          string | undefined,
        ];

        // enforce to add an emoji of 2 characters
        if (!name || name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }
        if (!role) {
          return "Debes mencionar un rol";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) return "No se encontró el emoji";

        await editEmoji(
          bot,
          message.guildId,
          emoji.id,
          {
            roles: emoji.roles
              ? [BigInt(role), ...emoji.roles]
              : [BigInt(role)],
          },
        );

        return `Limité el emoji ${emoji.name} al rol <@&${role}>`;
      }
      case "remove": {
        const [name] = <[string | undefined]> options;

        // enforce to add an emoji of 2 characters
        if (!name || name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) return "No se encontró el emoji";

        await deleteEmoji(
          bot,
          message.guildId,
          BigInt(emoji.id),
        );

        return `Elminé el emoji ${emoji.name}`;
      }
      case "add": {
        const [name, image] = options as [
          string | undefined,
          string | undefined,
        ];

        // enforce to add an emoji of 2 characters
        if (!name || name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        if (!image) return "Debes enviar un link con una imágen";

        const emoji = await createEmoji(bot, message.guildId, {
          name,
          image,
        });

        if (!emoji) return "No se creó el emoji";

        return `Creé el emoji ${emoji.name} -> <:${emoji.name}:${emoji.id}>`;
      }
      default: {
        return <Embed> {
          color: randomHex(),
          // TODO: make less painful to read
          description: `Emotes: ${
            guild.emojis.map((e) =>
              `<${e.animated ? "a:" : ":"}${e.name}:${e.id}>`
            ).join(" ")
          }`,
          footer: {
            text: guild.id.toString(),
          },
        };
      }
    }
  },
};
