import { type Context, Command } from "oasis";
import { Category, isInvite } from "utils";
import { deleteMessage } from "discordeno";

@Command({
  name: "say",
  meta: {
    descr: "Hace que el bot diga algo muy malo",
    short: "Escribir el mensaje del bot",
    usage: "<Input>",
  },
  category: Category.Fun,
})
export default class {
  async execute({ bot, message, args: { args } }: Context<false>) {
    const toSend = args.join(" ");

    if (!toSend) {
      return "Debes escribir algo";
    }

    if (isInvite(toSend)) {
      return "No puedo enviar invites";
    }

    await deleteMessage(bot, message.channelId, message.id).catch(() => {});

    return toSend;
  }
}
