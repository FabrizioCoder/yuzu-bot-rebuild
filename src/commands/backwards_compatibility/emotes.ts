import type { Command } from "../../types/command.ts";
import type {
  DiscordenoGuild,
  DiscordenoUser,
  Embed,
  ModifyGuildEmoji,
} from "../../../deps.ts";
import { Division, randomHex } from "../../utils/mod.ts";
import {
  avatarURL,
  createEmoji,
  deleteEmoji,
  editEmoji,
} from "../../../deps.ts";

export default <Command<false>> {
  options: {
    guildOnly: true,
    adminOnly: false,
    information: {
      descr: "Muestra emotes del server, añade y remueve emotes",
      usage: "",
    },
  },
  division: Division.INFO,
  data: "emotes",
  async execute(bot, message, { args }) {
    const [option, ...options] = args;

    if (!message.guildId) return;

    const guild = <DiscordenoGuild | undefined> bot.cache.guilds.get(
      message.guildId,
    );
    const author = <DiscordenoUser | undefined> bot.cache.users.get(
      message.authorId,
    );

    if (!guild) return;
    if (!author) return;

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

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) return "No se encontró el emoji";

        // TODO: editEmoji() has to be typed { roles } as string[] not bigint[]
        await editEmoji(
          bot,
          message.guildId,
          BigInt(emoji.id),
          {
            roles: emoji.roles ? [role, ...emoji.roles] : [role],
          } as ModifyGuildEmoji & { roles: string[] }, // fixing
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
