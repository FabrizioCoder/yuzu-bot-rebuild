import type { Command } from "../types/command.ts";
import { Category, isInvite } from "utils";
import { deleteMessage } from "discordeno";

export default <Command<false>> {
  options: {
    isGuildOnly: false,
    isAdminOnly: false,
    information: {
      descr: "Hace que el bot diga algo muy malo",
      short: "Escribir el mensaje del bot",
      usage: "<Input>",
    },
  },
  data: { name: "say" },
  category: Category.Fun,
  async execute({ bot, message, args: { args } }) {
    const toSend = args.join(" ");

    if (!toSend) {
      return "Debes escribir algo";
    }

    if (isInvite(toSend)) {
      return "No puedo enviar invites";
    }

    await deleteMessage(bot, message.channelId, message.id).catch(() => {});

    return toSend;
  },
};
