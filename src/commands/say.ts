import type { Command } from "../types/command.ts";
import { Division } from "../utils/mod.ts";
import { deleteMessage, hasGuildPermissions, sendMessage } from "../../deps.ts";

export default <Command<false>> {
  data: { name: "say" },
  division: Division.OWNER,
  async execute(bot, message, { args }) {
    const toSend = args.join(" ");
    if (!toSend) return "Debes escribir algo";

    const msg = await sendMessage(bot, message.channelId, toSend);

    if (msg.guildId) {
      const canDeleteMessages = await hasGuildPermissions(
        bot as any,
        msg.guildId,
        bot.id,
        ["MANAGE_MESSAGES"],
      );
      if (canDeleteMessages) await deleteMessage(bot, msg.channelId, msg.id);
    }
  },
};
