import { createMessageCommand } from "oasis";
import { Category, Configuration, toCapitalCase } from "utils";
import { getChannel, getUser } from "discordeno";
import { hasGuildPermissions } from "permissions_plugin";
import {
  addTag,
  editTag,
  findTag,
  getCollection,
  getTag,
  passTag,
  removeTag,
} from "../../../database/controllers/tag_controller.ts";
import { db } from "../../../database/db.ts";

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

export default createMessageCommand({
  name: "t",
  isGuildOnly: true,
  meta: {
    descr: "Crea, edita, borra o modifica tags",
    short: "Crea, edita, borra o modifica tags",
    usage:
      "[add(name, content) | remove(name) | give(name, @user) | edit(name, content) | list() | nsfw(name) | owner(name)] [search] ...",
  },
  category: Category.Fun,
  async execute({ bot, message, args }) {
    const [option, ...options] = args.args;

    if (!message.guildId) return;
    if (!option) return;
    if (!db) return;

    const search = Arguments[toCapitalCase(option) as keyof typeof Arguments];

    switch (search) {
      case Arguments.Add: {
        const [name, ...content] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (tag) return "Ese tag ya existe";

        await addTag(getCollection(db), message.guildId, message.authorId, {
          name,
          content: content.join(" "),
        });

        const output = await getTag(getCollection(db), name, message.guildId);

        return `Añadí el tag ${output?.name}`;
      }
      case Arguments.Remove: {
        const [name] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) return "No encontré ese tag";

        const isAdmin = message.member ? hasGuildPermissions(bot, message.guildId, message.member, ["ADMINISTRATOR"]) : false;

        if (BigInt(tag.user) !== message.authorId && !isAdmin && message.authorId !== Configuration.OWNER_ID) {
          return "El tag no te pertenece";
        }

        if (tag.global && message.authorId !== Configuration.OWNER_ID) {
          return "El tag es global y no se puede remover";
        }

        await removeTag(getCollection(db), message.guildId, message.authorId, tag.name);

        return `Removí el tag ${tag.name}`;
      }
      case Arguments.Give: {
        const [name, userId] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) return "No encontré ese tag";

        const user = bot.users.get(BigInt(userId)) ?? await getUser(bot, BigInt(userId));

        if (!user || user.bot) return "No encontré ese usuario";

        await passTag(getCollection(db), message.guildId, user.id, {
          server: message.guildId.toString(),
          user: user.id.toString(),
          global: tag.nsfw,
          nsfw: tag.nsfw,
        });

        const output = await getTag(getCollection(db), tag.name, message.guildId);

        return `<@${user.id}>! <@${message.authorId}> te ha regalado el #tag ${output?.name}`;
      }
      case Arguments.Edit: {
        const [name, ...content] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) return "No encontré ese tag";

        if (BigInt(tag.user) !== message.authorId) {
          return "El tag no te pertenece";
        }

        await editTag(getCollection(db), tag, {
          content: content.join(" "),
          attachments: [],
        });

        const output = await getTag(getCollection(db), tag.name, message.guildId);

        return `Edité el tag ${output?.name}`;
      }
      case Arguments.List: {
        const [userId] = <[string | undefined]>options;

        const tags = await findTag(getCollection(db), message.guildId, BigInt(userId ?? message.authorId));

        return tags.map((tag) => tag.name).join(", ");
      }
      case Arguments.Nsfw: {
        const [name] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) return "No encontré ese tag";

        const isAdmin = message.member ? hasGuildPermissions(bot, message.guildId, message.member, ["ADMINISTRATOR"]) : false;

        if (BigInt(tag.user) !== message.authorId && !isAdmin) {
          return "El tag no te pertenece";
        }

        if (tag.global) return "No se puede marcar un tag global";

        await editTag(getCollection(db), tag, {
          global: false,
          nsfw: !tag.nsfw,
        });

        const output = await getTag(getCollection(db), tag.name, message.guildId);

        return `Edité el tag ${output?.name} como **${!output?.nsfw ? "sfw" : "nsfw"}**`;
      }
      case Arguments.Owner: {
        const [name] = options;
        const tag = await getTag(getCollection(db), name, message.guildId);

        if (!tag) return "No encontré ese tag";

        return `ID: ${tag.user} <@${tag.user}>`;
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

          return "No encontré ese tag";
        }

        const channel = bot.channels.get(message.channelId) ?? await getChannel(bot, message.channelId);
        const safe = !channel?.nsfw;

        if (tag.nsfw && safe) {
          return "Contenido nsfw, lo sentimos pero no se puede mostrar en éste canal :underage:";
        }

        return tag.content;
      }
    }
  },
});
