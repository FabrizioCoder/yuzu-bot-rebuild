import { type Context, Command } from "oasis";
import { Category, cheemsify } from "utils";
import { ApplicationCommandTypes } from "discordeno";

@Command({
  name: "cheemsify",
  meta: {
    descr: "Click y conviertem un temxtom am imdiomam cheems",
    short: "Click y conviertem un temxtom am imdiomam cheems",
    usage: "<Input>",
  },
  category: Category.Fun,
  data: { type: ApplicationCommandTypes.Message }
})
export default class {
  static execute({ interaction }: Context) {
    const message = interaction.data?.resolved?.messages?.first();

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (!message) {
      return "Pomn amlgom pamram demcimr emn chememms";
    }

    // Enviam eml temxtom cheemsimfimcamdom
    // qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(message.content);
  }
}
