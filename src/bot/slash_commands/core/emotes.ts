import { type Context, Command, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";
import {
  ApplicationCommandOptionTypes,
  avatarURL,
  createEmoji,
  deleteEmoji,
  editEmoji,
  getGuild,
} from "discordeno";
import { hasGuildPermissions } from "permissions_plugin";

@Command({
  name: "emotes",
  description: "Muestra, añade y remueve emotes",
  isGuildOnly: true,
  category: Category.Config,
  meta: {
    descr: "Muestra, añade y remueve emotes",
    usage: "emotes | add | remove | hide | display [name] [url]",
  },
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
})
export default abstract class {
  static async execute({ bot, interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.SubCommand) {
      return;
    }

    if (!interaction.guildId) {
      return;
    }

    const guild = bot.guilds.get(interaction.guildId) ?? await getGuild(bot, interaction.guildId);

    if (!guild) {
      return;
    }

    if (option.name !== "display") {
      const isStaff = interaction.member
        ? hasGuildPermissions(bot, guild.id, interaction.member, ["MANAGE_EMOJIS"])
        : false;

      if (!isStaff) {
        return "No posees suficientes permisos";
      }
    }

    switch (option.name) {
      case "hide": {
        const [name, role] = option.options?.map((o) => o.value) as [
          string,
          string // role id
        ];
        // enforce to add an emoji of at least 2 characters
        if (name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) return "No se encontró el emoji";

        await editEmoji(bot, guild.id, emoji.id, {
          roles: emoji.roles ? [BigInt(role), ...emoji.roles] : [BigInt(role)],
        });

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

        await deleteEmoji(bot, guild.id, BigInt(emoji.id));

        return `Elminé el emoji ${emoji.name}`;
      }
      case "add": {
        const [name, image] = option.options?.map((o) => o.value) as [string, string];
        // enforce to add an emoji of 2 characters
        if (name.length < 2) {
          return "El emoji debe tener al menos 2 caracteres";
        }

        const emoji = await createEmoji(bot, guild.id, {
          name,
          image,
        });

        if (!emoji) return "No se creó el emoji";

        return `Creé el emoji ${emoji.name} -> <:${emoji.name}:${emoji.id}>`;
      }
      default: {
        const emojis = guild.emojis.map((e) => `<${e.animated ? "a:" : ":"}${e.name}:${e.id}>`);

        const avatar = avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
          avatar: interaction.user.avatar,
        });

        const embed = MessageEmbed
          .new()
          .author(`${interaction.user.username}#${interaction.user.discriminator}`, avatar)
          .color(randomHex())
          .description(`Emotes: ${emojis.join(" ")}`)
          .footer(guild.id.toString())
          .end();

        return embed;
      }
    }
  }
}
