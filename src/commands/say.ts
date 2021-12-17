import type { Command } from "../types/command.ts";
import { Division, isInvite } from "../utils/mod.ts";
import { deleteMessage } from "../../deps.ts";

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Hace que el bot diga algo muy malo",
      short: "Escribir el mensaje del bot",
      usage: "<Input>",
    },
  },
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

    await deleteMessage(bot, message.channelId, message.id).catch(() => {});

    return toSend;
  },
};
