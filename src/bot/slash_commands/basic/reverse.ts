import { type Context, Command, Option } from "oasis";
import { Category } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

@Command({
  name: "reverse",
  description: "Invierte un texto",
  meta: {
    descr: "Invierte un texto",
    short: "Invierte un texto",
    usage: "<Input>",
  },
  category: Category.Fun,
})
@Option({
  type: ApplicationCommandOptionTypes.String,
  required: true,
  name: "input",
  description: "Reverse 🔄",
})
export default abstract class {
  static execute({ interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      return (option.value as string).split("").reverse().join("");
    }
  }
}
