import { createMessageCommand } from "oasis/commando";
import { Category, isNotAscii, translate } from "utils";
import { hasGuildPermissions } from "permissions_plugin";
import { addPrefix, editPrefix, getCollection, getPrefix } from "database/controllers/prefix_controller.ts";
import { db } from "database/db";

createMessageCommand({
  names: ["prefix", "setprefix"],
  isGuildOnly: true,
  meta: {
    descr: "commands:prefix:DESCRIPTION",
    usage: "commands:prefix:USAGE",
  },
  category: Category.Config,
  translated: true,
  async execute({ bot, message, args: { args, prefix } }) {
    if (!db || !message.guildId) {
      return;
    }

    const [input] = args;

    if (!input) {
      return translate(bot, "commands:prefix:ON_NO_PREFIX", message.guildId, {
        prefix,
      });
    }

    if (isNotAscii(input)) {
      return "commands:prefix:ON_INVALID_PREFIX";
    }

    // the prefix (may be undefined)
    const guildPrefix = await getPrefix(getCollection(db), message.guildId);

    // permission checks
    const isStaff = message.member
      ? hasGuildPermissions(bot, message.guildId, message.member, ["MANAGE_GUILD"])
      : false;

    if (!isStaff) {
      return "commands:prefix:ON_MISSING_PERMISSIONS";
    }

    if (guildPrefix) {
      await editPrefix(getCollection(db), message.guildId, input);

      const newPrefix = await getPrefix(getCollection(db), message.guildId);

      return translate(bot, "commands:prefix:ON_PREFIX_CREATED", message.guildId, {
        prefix: newPrefix?.prefix,
      });
    } else {
      await addPrefix(getCollection(db), message.guildId, input);

      const newPrefix = await getPrefix(getCollection(db), message.guildId);

      return translate(bot, "commands:prefix:ON_PREFIX_UPDATED", message.guildId, {
        prefix: newPrefix?.prefix,
        old: prefix,
      });
    }
  },
});
