import { type Context, Command } from "oasis";
import { Category, isNotAscii } from "utils";
import { hasGuildPermissions } from "permissions_plugin";
import { addPrefix, editPrefix, getCollection, getPrefix } from "../../../database/controllers/prefix_controller.ts";
import { db } from "../../../database/db.ts";

@Command({
  name: "prefix",
  isGuildOnly: true,
  meta: {
    descr: "Actualiza el prefix del servidor",
    short: "Actualiza el prefix del servidor",
    usage: "<Input>",
  },
  category: Category.Config,
})
export default class {
  async execute({ bot, message, args: { args, prefix } }: Context<false>) {
    if (!db || !message.guildId) {
      return;
    }

    const [input] = args;

    if (!input) {
      return `El prefix actual es ${prefix}`;
    }

    if (isNotAscii(input)) {
      return "El prefix no puede contener caracteres especiales";
    }

    // the prefix (may be undefined)
    const guildPrefix = await getPrefix(getCollection(db), message.guildId);

    // permission checks
    const isStaff = message.member ? hasGuildPermissions(bot, message.guildId, message.member, ["MANAGE_GUILD"]) : false;

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
  }
}
