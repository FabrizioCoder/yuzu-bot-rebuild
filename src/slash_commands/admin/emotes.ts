import type { Command } from "../../types/command.ts";
import type {
  DiscordenoGuild,
  Embed,
  ModifyGuildEmoji,
} from "../../../deps.ts";
import { Division, randomHex } from "../../utils/mod.ts";
import {
  ApplicationCommandOptionTypes,
  avatarURL,
  createEmoji,
  deleteEmoji,
  editEmoji,
  hasGuildPermissions,
} from "../../../deps.ts";

export default <Command> {
  options: {
    guildOnly: true,
    adminOnly: false,
    information: {
      descr: "Muestra emotes del server, añade y remueve emotes",
      usage: "emotes | add | remove | hide | display [name] [url]",
    },
  },
  division: Division.INFO,
  data: {
    name: "emotes",
    description: "Muestra emotes del server, añade y remueve emotes",
    options: [
      {
        type: ApplicationCommandOptionTypes.SubCommand,
        name: "add",
        description: "Añade un emoji",
        options: [
          {
            type: ApplicationCommandOptionTypes.String,
            name: "name",
            required: true,
            description: "El nombre del emoji",
          },
          {
            type: ApplicationCommandOptionTypes.String,
            name: "url",
            required: true,
            description: "El link del emoji",
          },
        ],
      },
      {
        type: ApplicationCommandOptionTypes.SubCommand,
        name: "remove",
        description: "Remueve un emoji",
        options: [
          {
            type: ApplicationCommandOptionTypes.String,
            name: "name",
            required: true,
            description: "El nombre del emoji",
          },
        ],
      },
      {
        type: ApplicationCommandOptionTypes.SubCommand,
        name: "hide",
        description: "Limita un emoji a un rol",
        options: [
          {
            type: ApplicationCommandOptionTypes.String,
            name: "name",
            required: true,
            description: "El nombre del emoji",
          },
          {
            type: ApplicationCommandOptionTypes.Role,
            name: "role",
            required: true,
            description: "El nombre del rol",
          },
        ],
      },
      {
        type: ApplicationCommandOptionTypes.SubCommand,
        name: "display",
        description: "Muestra todos los emojis del servidor",
      },
    ],
  },
  async execute(bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.SubCommand) return;
    if (!interaction.guildId) return;

    const guild = <DiscordenoGuild | undefined> bot.cache.guilds.get(
      interaction.guildId,
    );

    if (!guild) return;

    if (option.name !== "display") {
      const hasPermission = await hasGuildPermissions(
        bot as any,
        interaction.guildId,
        interaction.user.id,
        ["MANAGE_EMOJIS"],
      );
      if (!hasPermission) return "No posees suficientes permisos";
    }

    switch (option.name) {
      case "hide": {
        const [name, role] = option.options?.map((o) => o.value) as [
          string,
          string, // role id
        ];
        // enforce to add an emoji of 2 characters
        if (name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) return "No se encontró el emoji";

        // TODO: editEmoji() has to be typed { roles } as string[] not bigint[]
        await editEmoji(
          bot,
          interaction.guildId,
          BigInt(emoji.id),
          {
            roles: emoji.roles ? [role, ...emoji.roles] : [role],
          } as ModifyGuildEmoji & { roles: string[] }, // fixing
        );

        return `Limité el emoji ${emoji.name} al rol <@&${role}>`;
      }
      case "remove": {
        const [name] = <[string]> option.options?.map((o) => o.value);

        // enforce to add an emoji of 2 characters
        if (name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) return "No se encontró el emoji";

        await deleteEmoji(
          bot,
          interaction.guildId,
          BigInt(emoji.id),
        );

        return `Elminé el emoji ${emoji.name}`;
      }
      case "add": {
        const [name, image] = option.options?.map((o) => o.value) as [
          string,
          string,
        ];
        // enforce to add an emoji of 2 characters
        if (name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        const emoji = await createEmoji(bot, interaction.guildId, {
          name,
          image,
        });

        if (!emoji) return "No se creó el emoji";

        return `Creé el emoji ${emoji.name} -> <:${emoji.name}:${emoji.id}>`;
      }
      default: {
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
