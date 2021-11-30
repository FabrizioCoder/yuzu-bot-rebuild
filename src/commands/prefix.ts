import type { Command } from "../types/command.ts";
import type { PrefixSchema } from "../database/models/prefix_model.ts";

import { Options } from "../utils/mod.ts";
import { hasGuildPermissions } from "../../deps.ts";
import {
  addPrefix,
  editPrefix,
  getPrefix,
} from "../database/controllers/prefix_controller.ts";
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
  data: "prefix",
  async execute(bot, message, { args }) {
    if (!db || !message.guildId) return;

    const input = args[0];
    const guildPrefix = await getPrefix(
      db.collection<PrefixSchema>("prefixes"),
      message.guildId,
    );

    if (!input) {
      return `El prefix actual es ${guildPrefix?.prefix ?? Options.PREFIX}`;
    }

    const hasPermissions = await hasGuildPermissions(
      bot as any,
      message.guildId,
      message.authorId,
      [
        "MANAGE_GUILD",
      ],
    );

    if (hasPermissions) {
      return "No posees suficientes permisos";
    }

    if (guildPrefix) {
      await editPrefix(
        db.collection<PrefixSchema>("prefixes"),
        message.guildId,
        input,
      );
      const newPrefix = await getPrefix(
        db.collection<PrefixSchema>("prefixes"),
        message.guildId,
      );
      return `El prefix se ha actualizado a ${newPrefix?.prefix}`;
    } else {
      await addPrefix(
        db.collection<PrefixSchema>("prefixes"),
        message.guildId,
        input,
      );
      const newPrefix = await getPrefix(
        db.collection<PrefixSchema>("prefixes"),
        message.guildId,
      );
      return `El prefix nuevo será ${newPrefix?.prefix}`;
    }
  },
};
