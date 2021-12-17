import type { Command } from "../types/command.ts";
import { Division, isInvite } from "../utils/mod.ts";
import { deleteMessage, sendMessage } from "../../deps.ts";

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

    await sendMessage(bot, message.channelId, {
      content: toSend,
      allowedMentions: {
        users: [message.authorId],
        roles: [],
      },
    });
    await deleteMessage(bot, message.channelId, message.id).catch(() => {});
  },
};
