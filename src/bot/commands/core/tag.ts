import { createCommand, createMessageCommand } from "oasis/commando";
import { ChatInputApplicationCommandBuilder } from "oasis/builders";
import { hasPermission, toPermissionsBitfield } from "oasis/permissions";
import { Category, Configuration, toCapitalCase, translate } from "utils";
import { ApplicationCommandOptionTypes, getChannel, getGuild, getUser } from "discordeno";
import {
  addTag,
  editTag,
  findTag,
  getCollection,
  getTag,
  passTag,
  removeTag,
} from "database/controllers/tag_controller.ts";
import { db } from "database/db";

enum Arguments {
  Add,
  Remove,
  Give,
  Edit,
  List,
  Nsfw,
  Owner,
  Display,
}

createCommand({
  meta: {
    descr: "commands:tag:DESCRIPTION",
    usage: "commands:tag:USAGE",
  },
  category: Category.Fun,
  translated: true,
  async execute({ bot, interaction }) {
    if (!db) return;

    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.SubCommand) return;

    if (!interaction.guildId || !interaction.channelId) {
      return;
    }

    const guild = bot.guilds.get(interaction.guildId) ?? (await getGuild(bot, interaction.guildId));
    const channel = bot.channels.get(interaction.channelId) ?? (await getChannel(bot, interaction.channelId));

    switch (Arguments[toCapitalCase(option.name) as keyof typeof Arguments]) {
      case Arguments.Add: {
        const [name, content] = option.options?.map((o) => o.value) as [string, string];
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (tag) {
          return "commands:tag:ON_TAG_CLAIMED";
        }

        await addTag(getCollection(db), interaction.guildId, interaction.user.id, {
          name,
          content,
        });

        const output = await getTag(getCollection(db), name, interaction.guildId);

        return translate(bot, "commands:ON_TAG_CREATED", interaction.guildId, {
          tagName: output?.name,
        });
      }
      case Arguments.Remove: {
        const [name] = <[string]>option.options?.map((o) => o.value);
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        const isAdmin = interaction.member
          ? hasPermission(toPermissionsBitfield(guild, interaction.member), "ADMINISTRATOR")
          : false;

        if (
          tag.userId.toBigInt() !== interaction.user.id &&
          !isAdmin &&
          interaction.user.id !== Configuration.misc.ownerId
        ) {
          return "commands:tag:ON_TAG_OWNERSHIP_DOES_NOT_BELONG";
        }

        if (tag.isGlobal && interaction.user.id !== Configuration.misc.ownerId) {
          return "commands:tag:ON_TAG_GLOBAL";
        }

        await removeTag(getCollection(db), interaction.guildId, interaction.user.id, tag.name);

        return translate(bot, "commands:tag:ON_TAG_DELETED", interaction.guildId, { tagName: tag.name });
      }
      case Arguments.Give: {
        const [name, userId] = option.options?.map((o) => o.value) as [string, string];
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        const user = bot.users.get(BigInt(userId)) ?? (await getUser(bot, BigInt(userId)));

        if (!user || user.bot) {
          return "commands:tag:ON_USER_NOT_FOUND";
        }

        await passTag(getCollection(db), interaction.guildId, user.id, {
          guildId: interaction.guildId,
          userId: user.id,
          isGlobal: tag.isGlobal,
          isNsfw: tag.isNsfw,
        });

        const output = await getTag(getCollection(db), tag.name, interaction.guildId);

        return translate(bot, "commands:tag:ON_TAG_GIFTED", interaction.guildId, {
          userId: user.id,
          authorTag: interaction.user.username,
          tagName: output?.name,
        });
      }
      case Arguments.Edit: {
        const [name, content] = option.options?.map((o) => o.value) as [string, string];
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        if (tag.userId.toBigInt() !== interaction.user.id) {
          return "commands:tag:ON_TAG_OWNERSHIP_DOES_NOT_BELONG";
        }

        await editTag(
          getCollection(db),
          {
            guildId: tag.guildId.toBigInt(),
            userId: tag.userId.toBigInt(),
            name: tag.name,
          },
          { content, attachments: [] }
        );

        const output = await getTag(getCollection(db), tag.name, interaction.guildId);

        return translate(bot, "commands:tag:ON_TAG_EDITED", interaction.guildId, { tagName: output?.name });
      }
      case Arguments.List: {
        const [userId] = <[string | undefined]>option.options?.map((o) => o.value);

        const tags = await findTag(getCollection(db), interaction.guildId, BigInt(userId ?? interaction.user.id));

        return tags.map((tag) => tag.name).join(", ");
      }
      case Arguments.Nsfw: {
        const [name] = <[string]>option.options?.map((o) => o.value);
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        const isAdmin = interaction.member
          ? hasPermission(toPermissionsBitfield(guild, interaction.member), "ADMINISTRATOR")
          : false;

        if (tag.userId.toBigInt() !== interaction.user.id && !isAdmin) {
          return "commands:tag:ON_TAG_OWNERSHIP_DOES_NOT_BELONG";
        }

        if (tag.isGlobal) {
          return "commands:tag:ON_TAG_GLOBAL";
        }

        await editTag(
          getCollection(db),
          {
            guildId: tag.guildId.toBigInt(),
            userId: tag.userId.toBigInt(),
            name: tag.name,
          },
          {
            isGlobal: false,
            isNsfw: !tag.isNsfw,
          }
        );

        const output = await getTag(getCollection(db), tag.name, interaction.guildId);

        return translate(bot, "commands:tag:ON_TAG_NSFW", interaction.guildId, {
          tagName: output?.name,
          level: output?.isNsfw ? "nsfw" : "sfw",
        });
      }
      case Arguments.Owner: {
        const [name] = <[string]>option.options?.map((o) => o.value);
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        return `ID: ${tag.userId.toBigInt()} <@${tag.userId.toBigInt()}>`;
      }
      case Arguments.Display: {
        if (!interaction.channelId) return;

        const [name] = <[string]>option.options?.map((o) => o.value);
        const tagGlobal = await getTag(getCollection(db), name);

        if (tagGlobal) {
          return tagGlobal.content;
        }

        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        const safe = !channel?.nsfw;

        if (tag.isNsfw && safe) {
          return "commands:tag:ON_NSFW_CONTENT";
        }

        return tag.content;
      }
    }
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("tag")
    .setDescription("Crea, edita, borra o modifica tags")
    .addSubCommand((command) =>
      command
        .setName("add")
        .setDescription("Add a tag")
        .addStringOption((o) => o.setName("name").setDescription("Tag's name").setRequired(true))
        .addStringOption((o) => o.setName("content").setDescription("Tag's content'").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("remove")
        .setDescription("Remove a tag")
        .addStringOption((o) => o.setName("name").setDescription("Tag's name").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("give")
        .setDescription("Give a tag to a user as a gift")
        .addStringOption((o) => o.setName("name").setDescription("Tag's name").setRequired(true))
        .addUserOption((o) => o.setName("user").setDescription("User to gift the tag").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("edit")
        .setDescription("Edit a tag")
        .addStringOption((o) => o.setName("name").setDescription("Tag's name").setRequired(true))
        .addStringOption((o) => o.setName("content").setDescription("Tag's (new) content'").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("list")
        .setDescription("Find all of the tags in the current server")
        .addUserOption((o) => o.setName("user").setDescription("(Optionally a user to search their tags)"))
    )
    .addSubCommand((command) =>
      command
        .setName("nsfw")
        .setDescription("Set a tag as nsfw content")
        .addStringOption((o) => o.setName("name").setDescription("Tag's name").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("owner")
        .setDescription("Get the owner of the given tag")
        .addStringOption((o) => o.setName("name").setDescription("Tag's name").setRequired(true))
    )
    .addSubCommand((command) =>
      command
        .setName("display")
        .setDescription("Display a tag")
        .addStringOption((o) => o.setName("name").setDescription("Tag's name").setRequired(true))
    )
    .toJSON(),
});

createMessageCommand({
  names: ["tag", "t"],
  isGuildOnly: true,
  meta: {
    descr: "commands:tag:DESCRIPTION",
    usage: "commands:tag:USAGE",
  },
  category: Category.Fun,
  translated: true,
  async execute({ bot, message, args }) {
    const [option, ...options] = args.args;

    if (!message.guildId) return;
    if (!option) return;
    if (!db) return;

    const search = Arguments[toCapitalCase(option) as keyof typeof Arguments];

    const guild = bot.guilds.get(message.guildId) ?? (await getGuild(bot, message.guildId));

    switch (search) {
      case Arguments.Add: {
        const [name, ...content] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (tag) {
          return "commands:tag:ON_TAG_CLAIMED";
        }

        await addTag(getCollection(db), message.guildId, message.authorId, {
          name,
          content: content.join(" "),
        });

        const output = await getTag(getCollection(db), name, message.guildId);

        return translate(bot, "commands:tag:ON_TAG_CREATED", message.guildId, {
          tagName: output?.name,
        });
      }
      case Arguments.Remove: {
        const [name] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        const isAdmin = message.member
          ? hasPermission(toPermissionsBitfield(guild, message.member), "ADMINISTRATOR")
          : false;

        if (tag.userId.toBigInt() !== message.authorId && !isAdmin && message.authorId !== Configuration.misc.ownerId) {
          return "commands:tag:ON_TAG_OWNERSHIP_DOES_NOT_BELONG";
        }

        if (tag.isGlobal && message.authorId !== Configuration.misc.ownerId) {
          return "commands:tag:ON_TAG_GLOBAL";
        }

        await removeTag(getCollection(db), message.guildId, message.authorId, tag.name);

        return translate(bot, "commands:tag:ON_TAG_DELETED", message.guildId, {
          tagName: tag?.name,
        });
      }
      case Arguments.Give: {
        const [name, userId] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        const user = bot.users.get(BigInt(userId)) ?? (await getUser(bot, BigInt(userId)));

        if (!user || user.bot) {
          return "commands:tag:USER_NOT_FOUND";
        }

        await passTag(getCollection(db), message.guildId, user.id, {
          guildId: message.guildId,
          userId: user.id,
          isGlobal: tag.isGlobal,
          isNsfw: tag.isNsfw,
        });

        const output = await getTag(getCollection(db), tag.name, message.guildId);

        return translate(bot, "commands:tag:ON_TAG_GIFTED", message.guildId, {
          userId: user.id,
          tagName: output?.name,
          authorTag: message.tag,
        });
      }
      case Arguments.Edit: {
        const [name, ...content] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        if (tag.userId.toBigInt() !== message.authorId) {
          return "commands:tag:ON_TAG_OWNERSHIP_DOES_NOT_BELONG";
        }

        await editTag(
          getCollection(db),
          {
            guildId: tag.guildId.toBigInt(),
            userId: tag.userId.toBigInt(),
            name: tag.name,
          },
          {
            content: content.join(" "),
            attachments: [],
          }
        );

        const output = await getTag(getCollection(db), tag.name, message.guildId);

        return translate(bot, "commands:tag:ON_TAG_EDITED", message.guildId, {
          tagName: output?.name,
        });
      }
      case Arguments.List: {
        const [userId] = <[string | undefined]>options;

        const tags = await findTag(getCollection(db), message.guildId, BigInt(userId ?? message.authorId));

        return tags.map((tag) => tag.name).join(", ");
      }
      case Arguments.Nsfw: {
        const [name] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        const isAdmin = message.member
          ? hasPermission(toPermissionsBitfield(guild, message.member), "ADMINISTRATOR")
          : false;

        if (tag.userId.toBigInt() !== message.authorId && !isAdmin) {
          return "commands:tag:ON_TAG_OWNERSHIP_DOES_NOT_BELONG";
        }

        if (tag.isGlobal) {
          return "commands:tag:ON_TAG_GLOBAL";
        }

        await editTag(
          getCollection(db),
          {
            guildId: tag.guildId.toBigInt(),
            userId: tag.userId.toBigInt(),
            name: tag.name,
          },
          {
            isGlobal: false,
            isNsfw: !tag.isNsfw,
          }
        );

        const output = await getTag(getCollection(db), tag.name, message.guildId);

        return translate(bot, "commands:tag:ON_TAG_NSFW", message.guildId, {
          tagName: output?.name,
          level: output?.isNsfw ? "nsfw" : "sfw",
        });
      }
      case Arguments.Owner: {
        const [name] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) {
          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        return `ID: ${tag.userId.toBigInt()} <@${tag.userId.toBigInt()}>`;
      }
      case Arguments.Display:
      default: {
        const name = options[0] ?? option;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) {
          const tagGlobal = await getTag(getCollection(db), name);

          if (tagGlobal) {
            return tagGlobal.content;
          }

          return "commands:tag:ON_TAG_NOT_FOUND";
        }

        const channel = bot.channels.get(message.channelId) ?? (await getChannel(bot, message.channelId));
        const safe = !channel?.nsfw;

        if (tag.isNsfw && safe) {
          return "commands:tag:ON_NSFW_CONTENT";
        }

        return tag.content;
      }
    }
  },
});
