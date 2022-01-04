import { type Context, Command } from "oasis";
import { Category } from "utils";
import { ApplicationCommandTypes } from "discordeno";
import { SafetyLevels, search } from "images";

@Command({
  name: "search",
  meta: {
    descr: "Click encima de un mensaje para buscar una imagen",
    short: "Click encima de un mensaje",
    usage: "<Input>",
  },
  category: Category.Util,
  data: { type: ApplicationCommandTypes.Message },
})
export default abstract class {
  static async execute({ interaction }: Context) {
    const message = interaction.data?.resolved?.messages?.first();

    if (message) {
      const [result] = await search(message.content, SafetyLevels.STRICT);

      if (result) {
        return result.image;
      }
    }
  }
}
