import type { Command } from "../types/command.ts";

import { Division, isInvite } from "../utils/mod.ts";
import {
  botHasGuildPermissions,
  deleteMessage,
  sendMessage,
} from "../../deps.ts";

export default <Command<false>> {
  data: { name: "say" },
  division: Division.OWNER,
  async execute(bot, message, { args }) {
    const toSend = args.join(" ");

    if (!toSend) {
      return "Debes escribir algo";
    }

    if (isInvite(toSend)) {
      return "No puedo enviar invites";
    }

    const msg = await sendMessage(bot, message.channelId, toSend);

    if (msg.guildId) {
      const canDeleteMessages = botHasGuildPermissions(
        bot,
        msg.guildId,
        ["MANAGE_MESSAGES"],
      );
      if (canDeleteMessages) await deleteMessage(bot, msg.channelId, msg.id);
    }
  },
};
