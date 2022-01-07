import type { Context } from "oasis";
import { Command, Option } from "oasis";
import { Category, isInvite } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

@Option({
  type: ApplicationCommandOptionTypes.String,
  required: true,
  name: "input",
  description: "📝📝📝📝📝",
})
@Command({
  name: "say",
  description: "Hace que el bot diga algo muy malo",
  meta: {
    descr: "Hace que el bot diga algo muy malo",
    short: "Escribir el mensaje del bot",
    usage: "<Input>",
  },
  category: Category.Fun,
})
export default class {
  static execute({ interaction }: Context) {
    const option = interaction.data?.options?.[0];

    // type guard
    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    if (typeof option.value === "string") {
      if (isInvite(option.value)) return "No puedo enviar invites";

      return option.value;
    }
  }
}
