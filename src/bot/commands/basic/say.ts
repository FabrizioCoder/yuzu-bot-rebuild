import { createMessageCommand } from "oasis/commando";
import { Category, isInvite } from "utils";
import { deleteMessage } from "discordeno";

createMessageCommand({
  names: ["say", "shadowsay", "esay"],
  meta: {
    descr: "commands:say:DESCRIPTION",
    usage: "commands:say:USAGE",
  },
  category: Category.Fun,
  translated: true,
  async execute({ bot, message, args: { args } }) {
    const toSend = args.join(" ");

    if (!toSend) {
      return "commands:say:ON_MISSING_TEXT";
    }

    if (isInvite(toSend)) {
      return "commands:say:CANNOT_SEND_INVITE_LINKS";
    }

    await deleteMessage(bot, message.channelId, message.id).catch(() => {});

    return toSend;
  },
});
