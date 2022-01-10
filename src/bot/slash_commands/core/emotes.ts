import { createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
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

export default createCommand({
  isGuildOnly: true,
  meta: {
    descr: "Muestra, añade y remueve emotes",
    usage: "emotes | add | remove | hide | display [name] [url]",
  },
  category: Category.Config,
  async execute({ bot, interaction }) {
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

        const { embed } = new MessageEmbed()
          .author(`${interaction.user.username}#${interaction.user.discriminator}`, avatar)
          .color(randomHex())
          .description(`Emotes: ${emojis.join(" ")}`)
          .footer(guild.id.toString());

        return embed;
      }
    }
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("emotes")
    .setDescription("Muestra, añade y remueve emotes")
    .addSubCommand((command) =>
      command
        .setName("add")
        .setDescription("Add an emoji")
        .addStringOption((o) => o.setName("name").setDescription("Emoji's name").setRequired(true))
        .addStringOption((o) => o.setName("link").setDescription("Emoji's link (url)").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("remove")
        .setDescription("Remove an emoji")
        .addStringOption((o) => o.setName("name").setDescription("Emoji's name").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("hide")
        .setDescription("Hide an emoji")
        .addStringOption((o) => o.setName("name").setDescription("Emoji's name").setRequired(true))
        .addRoleOption((o) => o.setName("role").setDescription("Role's mention").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("display")
        .setDescription("Display all of the emojis in the current server")
    )
    .toJSON(),
});
