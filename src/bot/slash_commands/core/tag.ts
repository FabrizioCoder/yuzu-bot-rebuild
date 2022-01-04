import { type Context, Command, Option, OptionIn } from "oasis";
import { Category, Configuration, toCapitalCase } from "utils";
import { ApplicationCommandOptionTypes, getChannel, getUser } from "discordeno";
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

@Command({
  name: "tag",
  description: "Crea, edita, borra o modifica tags",
  meta: {
    descr: "Crea, edita, borra o modifica tags",
    short: "Crea, edita, borra o modifica tags",
    usage: "[\
      add(name, content) |\
      remove(name) |\
      give(name, @user) |\
      edit(name, content) |\
      list() | nsfw(name) |\
      owner(name)] [search] ...",
  },
  category: Category.Fun,
})
@Option({
  type: ApplicationCommandOptionTypes.SubCommand,
  name: "add",
  description: "Añade un tag",
})
@OptionIn("add", {
  type: ApplicationCommandOptionTypes.String,
  name: "name",
  required: true,
  description: "El nombre del tag",
})
@OptionIn("add", {
  type: ApplicationCommandOptionTypes.String,
  name: "content",
  required: true,
  description: "El contenido del tag",
})
@Option({
  type: ApplicationCommandOptionTypes.SubCommand,
  name: "remove",
  description: "Remueve un tag",
})
@OptionIn("remove", {
  type: ApplicationCommandOptionTypes.String,
  name: "name",
  required: true,
  description: "El nombre del tag",
})
@Option({
  type: ApplicationCommandOptionTypes.SubCommand,
  name: "give",
  description: "Da un tag a un usuario",
})
@OptionIn("give", {
  type: ApplicationCommandOptionTypes.String,
  name: "name",
  required: true,
  description: "El nombre del tag",
})
@OptionIn("give", {
  type: ApplicationCommandOptionTypes.User,
  name: "user",
  required: true,
  description: "El usuario que recibirá el tag",
})
@Option({
  type: ApplicationCommandOptionTypes.SubCommand,
  name: "edit",
  description: "Edita un tag",
})
@OptionIn("edit", {
  type: ApplicationCommandOptionTypes.String,
  name: "name",
  required: true,
  description: "El nombre del tag",
})
@OptionIn("edit", {
  type: ApplicationCommandOptionTypes.String,
  name: "content",
  required: true,
  description: "El contenido del tag",
})
@Option({
  type: ApplicationCommandOptionTypes.SubCommand,
  name: "list",
  description: "Encuentra todos tus tags en el servidor",
})
@OptionIn("list", {
  type: ApplicationCommandOptionTypes.User,
  name: "user",
  required: false,
  description: "El usuario al que opcionalmente verificar",
})
@Option({
  type: ApplicationCommandOptionTypes.SubCommand,
  name: "nsfw",
  description: "Marca un tag como nsfw",
})
@OptionIn("nsfw", {
  type: ApplicationCommandOptionTypes.String,
  name: "name",
  required: true,
  description: "El nombre del tag",
})
@Option({
  type: ApplicationCommandOptionTypes.SubCommand,
  name: "owner",
  description: "Busca el dueño de un tag",
})
@OptionIn("owner", {
  type: ApplicationCommandOptionTypes.String,
  name: "name",
  required: true,
  description: "El nombre del tag",
})
@Option({
  type: ApplicationCommandOptionTypes.SubCommand,
  name: "display",
  description: "Busca un tag",
})
@OptionIn("hide", {
  type: ApplicationCommandOptionTypes.String,
  name: "name",
  required: true,
  description: "El nombre del tag",
})
export default class {
  static async execute({ bot, interaction }: Context) {
    if (!db) return;

    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.SubCommand) return;

    if (!interaction.guildId || !interaction.channelId) {
      return;
    }

    const channel = bot.channels.get(interaction.channelId) ?? await getChannel(bot, interaction.channelId);

    switch (Arguments[toCapitalCase(option.name) as keyof typeof Arguments]) {
      case Arguments.Add: {
        const [name, content] = option.options?.map((o) => o.value) as [string, string];
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (tag) return "Ese tag ya existe";

        await addTag(getCollection(db), interaction.guildId, interaction.user.id, {
          name,
          content,
        });

        const output = await getTag(getCollection(db), name, interaction.guildId);

        return `Añadí el tag ${output?.name}`;
      }
      case Arguments.Remove: {
        const [name] = <[string]>option.options?.map((o) => o.value);
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) return "No encontré ese tag";

        const isAdmin = interaction.member ? hasGuildPermissions(bot, interaction.guildId, interaction.member, ["ADMINISTRATOR"]) : false;

        if (BigInt(tag.user) !== interaction.user.id && !isAdmin && interaction.user.id !== Configuration.OWNER_ID) {
          return "El tag no te pertenece";
        }

        if (tag.global && interaction.user.id !== Configuration.OWNER_ID) {
          return "El tag es global y no se puede remover";
        }

        await removeTag(getCollection(db), interaction.guildId, interaction.user.id, tag.name);

        return `Removí el tag ${tag.name}`;
      }
      case Arguments.Give: {
        const [name, userId] = option.options?.map((o) => o.value) as [string, string];
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) return "No encontré ese tag";

        const user = bot.users.get(BigInt(userId)) ?? await getUser(bot, BigInt(userId));

        if (!user || user.bot) return "No encontré ese usuario";

        await passTag(getCollection(db), interaction.guildId, user.id, {
          server: interaction.guildId.toString(),
          user: user.id.toString(),
          global: tag.nsfw,
          nsfw: tag.nsfw,
        });

        const output = await getTag(getCollection(db), tag.name, interaction.guildId);

        return `<@${user.id}>! ${interaction.user.username} te ha regalado el #tag ${output?.name}`;
      }
      case Arguments.Edit: {
        const [name, content] = option.options?.map((o) => o.value) as [string, string];
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) return "No encontré ese tag";

        if (BigInt(tag.user) !== interaction.user.id) {
          return "El tag no te pertenece";
        }

        await editTag(getCollection(db), tag, { content, attachments: [] });

        const output = await getTag(getCollection(db), tag.name, interaction.guildId);

        return `Edité el tag ${output?.name}`;
      }
      case Arguments.List: {
        const [userId] = <[string | undefined]>option.options?.map((o) => o.value);

        const tags = await findTag(getCollection(db), interaction.guildId, BigInt(userId ?? interaction.user.id));

        return tags.map((tag) => tag.name).join(", ");
      }
      case Arguments.Nsfw: {
        const [name] = <[string]>option.options?.map((o) => o.value);
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) return "No encontré ese tag";

        const isAdmin = interaction.member ? hasGuildPermissions(bot, interaction.guildId, interaction.user.id, ["ADMINISTRATOR"]) : false;

        if (BigInt(tag.user) !== interaction.user.id && !isAdmin) {
          return "El tag no te pertenece";
        }

        if (tag.global) return "No se puede marcar un tag global";

        await editTag(getCollection(db), tag, {
          global: false,
          nsfw: !tag.nsfw,
        });

        const output = await getTag(getCollection(db), tag.name, interaction.guildId);

        return `Edité el tag ${output?.name} como **${!output?.nsfw ? "sfw" : "nsfw"}**`;
      }
      case Arguments.Owner: {
        const [name] = <[string]>option.options?.map((o) => o.value);
        const tag = await getTag(getCollection(db), name, interaction.guildId);

        if (!tag) return "No encontré ese tag";

        return `ID: ${tag.user} <@${tag.user}>`;
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
          return "No encontré ese tag";
        }

        const safe = !channel?.nsfw;

        if (tag.nsfw && safe) {
          return "Contenido nsfw, lo sentimos pero no se puede mostrar en éste canal :underage:";
        }

        return tag.content;
      }
    }
  }
}
