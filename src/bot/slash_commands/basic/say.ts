import { type Context, Command, Option } from "oasis";
import { Category, isInvite } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

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
@Option({
  type: ApplicationCommandOptionTypes.String,
  required: true,
  name: "input",
  description: "📝📝📝📝📝",
})
export default abstract class {
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
