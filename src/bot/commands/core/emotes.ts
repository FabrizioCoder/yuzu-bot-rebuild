import { createCommand, createMessageCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Category, randomHex, translate } from "utils";
import { ApplicationCommandOptionTypes, avatarURL, createEmoji, deleteEmoji, editEmoji, getGuild } from "discordeno";
import { botHasGuildPermissions, hasGuildPermissions } from "permissions_plugin";

createCommand({
  isGuildOnly: true,
  meta: {
    descr: "commands:emotes:DESCRIPTION",
    usage: "commands:emotes:USAGE",
  },
  category: Category.Config,
  translated: true,
  async execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.SubCommand) {
      return;
    }

    if (!interaction.guildId) {
      return;
    }

    const guild = bot.guilds.get(interaction.guildId) ?? (await getGuild(bot, interaction.guildId));

    if (!guild || !interaction.member) {
      return;
    }

    if (option.name !== "display") {
      const canManageEmojis = hasGuildPermissions(bot, guild, interaction.member, ["MANAGE_EMOJIS"]);

      if (!canManageEmojis) {
        return "commands:emotes:ON_MISSING_PERMISSIONS";
      }
      const botCanManageEmojis = botHasGuildPermissions(bot, guild, ["MANAGE_EMOJIS"]);

      if (!botCanManageEmojis) {
        return "commands:emotes:ON_BOT_MISSING_PERMISSIONS";
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
          return "commands:emotes:ON_INVALID_EMOJI_NAME";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) {
          return "commands:emotes:ON_EMOJI_NOT_FOUND";
        }

        if (emoji.roles?.includes(BigInt(role))) {
          return;
        }

        await editEmoji(bot, guild.id, emoji.id, {
          roles: emoji.roles ? [BigInt(role), ...emoji.roles].map((id) => id.toString()) : [role],
          // deno-lint-ignore no-explicit-any
        } as any & { roles: string[] });

        return translate(bot, "commands:emotes:ON_EMOJI_MODIFIED", interaction.guildId, {
          emojiName: emoji.name,
          roleId: role,
        });
      }
      case "remove": {
        const [name] = <[string]>option.options?.map((o) => o.value);

        // enforce to add an emoji of 2 characters
        if (name.length < 2) {
          return "commands:emotes:ON_INVALID_EMOJI_NAME";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) {
          return "commands:emotes:ON_EMOJI_NOT_FOUND";
        }

        await deleteEmoji(bot, guild.id, BigInt(emoji.id));

        return translate(bot, "commands:emotes:ON_EMOJI_DELETED", interaction.guildId, { emojiName: emoji.name });
      }
      case "add": {
        const [name, image] = option.options?.map((o) => o.value) as [string, string];
        // enforce to add an emoji of 2 characters
        if (name.length < 2 || guild.emojis.map((e) => e.name).includes(name)) {
          return "commands:emotes:ON_INVALID_EMOJI_NAME";
        }

        const emoji = await createEmoji(bot, guild.id, {
          name,
          image,
        });

        if (!emoji) {
          return "commands:emotes:ON_EMOJI_NOT_CREATED";
        }

        return translate(bot, "commands:emotes:ON_EMOJI_CREATED", interaction.guildId, {
          emojiMention: `<:${emoji.name}:${emoji.id}>`,
        });
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
      command.setName("display").setDescription("Display all of the emojis in the current server")
    )
    .toJSON(),
});

createMessageCommand({
  names: ["emotes", "emojis", "emoji", "emote"],
  isGuildOnly: true,
  meta: {
    descr: "commands:emotes:DESCRIPTION",
    usage: "commands:emotes:USAGE",
  },
  category: Category.Config,
  translated: true,
  async execute({ bot, message, args }) {
    const [option, ...options] = args.args;

    if (!message.guildId) {
      return;
    }

    const guild = bot.guilds.get(message.guildId) ?? (await getGuild(bot, message.guildId));

    if (!guild || !message.member) {
      return;
    }

    if (option?.toLowerCase() === "hide" || option?.toLowerCase() === "remove" || option?.toLowerCase() === "add") {
      const canManageEmojis = hasGuildPermissions(bot, guild, message.member, ["MANAGE_EMOJIS"]);

      if (!canManageEmojis) {
        return "commands:emotes:ON_MISSING_PERMISSIONS";
      }
      const botCanManageEmojis = botHasGuildPermissions(bot, guild, ["MANAGE_EMOJIS"]);

      if (!botCanManageEmojis) {
        return "commands:emotes:ON_BOT_MISSING_PERMISSIONS";
      }
    }

    switch (option?.toLowerCase()) {
      case "hide": {
        const [name, role] = options as [string | undefined, string | undefined];

        // enforce to add an emoji of 2 characters
        if (!name || name.length < 2) {
          return "commands:emotes:ON_INVALID_EMOJI_NAME";
        }

        if (!role) {
          return "commands:emotes:ON_INVALID_ROLE";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) {
          return "commands:emotes:ON_EMOJI_NOT_FOUND";
        }

        if (emoji.roles?.includes(BigInt(role))) {
          return;
        }

        await editEmoji(bot, guild.id, emoji.id, {
          roles: emoji.roles ? [BigInt(role), ...emoji.roles].map((id) => id.toString()) : [role],
          // deno-lint-ignore no-explicit-any
        } as any & { roles: string[] });

        return translate(bot, "commands:emotes:ON_EMOJI_MODIFIED", message.guildId, {
          emojiName: emoji.name,
          roleId: role,
        });
      }
      case "remove": {
        const [name] = <[string | undefined]>options;

        // enforce to add an emoji of 2 characters
        if (!name || name.length < 2) {
          return "commands:emotes:ON_INVALID_EMOJI_NAME";
        }

        const emoji = guild.emojis.find((emoji) => emoji.name === name);

        if (!emoji || !emoji.id) {
          return "commands:emotes:ON_EMOJI_NOT_FOUND";
        }

        await deleteEmoji(bot, guild.id, BigInt(emoji.id));

        return translate(bot, "commands:emotes:ON_EMOJI_DELETED", message.guildId, { emojiName: emoji.name });
      }
      case "add": {
        const [name, image] = options as [string | undefined, string | undefined];

        // enforce to add an emoji of at least 2 characters
        if (!name || name.length < 2 || guild.emojis.map((e) => e.name).includes(name)) {
          return "commands:emotes:ON_INVALID_EMOJI_NAME";
        }

        if (!image) {
          return "commands:emotes:ON_INVALID_LINK";
        }

        const emoji = await createEmoji(bot, guild.id, {
          name,
          image,
        });

        if (!emoji) {
          return "commands:emotes:ON_EMOJI_NOT_CREATED";
        }

        return translate(bot, "commands:emotes:ON_EMOJI_CREATED", message.guildId, {
          eemojiName: emoji.name,
          emojId: emoji.id,
        });
      }
      default: {
        const emojis = guild.emojis.map((e) => `<${e.animated ? "a:" : ":"}${e.name}:${e.id}>`);

        const { embed } = new MessageEmbed()
          .color(randomHex())
          .description(`Emotes: ${emojis.join(" ")}`)
          .footer(`${guild.id}`);

        return embed;
      }
    }
  },
});
