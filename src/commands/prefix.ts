import type { Command } from "../types/command.ts";
import { Category, isNotAscii } from "../utils/mod.ts";
import { hasGuildPermissions } from "../../deps.ts";
import { addPrefix, editPrefix, getCollection, getPrefix } from "../database/controllers/prefix_controller.ts";
import { db } from "../database/db.ts";

export default <Command<false>> {
  options: {
    guildOnly: true,
    adminOnly: false,
    information: {
      descr: "Actualiza el prefix del servidor",
      short: "Actualiza el prefix del servidor",
      usage: "<Input>",
    },
  },
  category: Category.Config,
  data: {
    name: "prefix",
  },
  async execute(bot, message, { args, prefix }) {
    if (!db || !message.guildId) return;

    const [input] = args;

    const guildPrefix = await getPrefix(getCollection(db), message.guildId);

    if (!input || !(0 in args)) {
      return `El prefix actual es ${prefix}`;
    }

    if (isNotAscii(input)) {
      return "El prefix no puede contener caracteres especiales";
    }

    const isStaff = hasGuildPermissions(bot, message.guildId, message.authorId, ["MANAGE_GUILD"]);

    if (!isStaff) {
      return "No posees suficientes permisos";
    }

    if (guildPrefix) {
      await editPrefix(getCollection(db), message.guildId, input);

      const newPrefix = await getPrefix(getCollection(db), message.guildId);

      return `El prefix se ha actualizado a ${newPrefix?.prefix}`;
    } else {
      await addPrefix(getCollection(db), message.guildId, input);

      const newPrefix = await getPrefix(getCollection(db), message.guildId);

      return `El prefix nuevo será ${newPrefix?.prefix}`;
    }
  },
};
