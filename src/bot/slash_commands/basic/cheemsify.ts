import { type Context, Command, Option } from "oasis";
import { Category, cheemsify } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

@Option({
  type: ApplicationCommandOptionTypes.String,
  name: "input",
  description: "Temxto a comvermtirm a imdioma cheems",
})
@Command({
  name: "cheemsify",
  description: "Conviertem un temxtom am imdiomam cheems",
  meta: {
    descr: "Conviertem un temxtom am imdiomam cheems",
    short: "Conviertem un temxtom am imdiomam cheems",
    usage: "<Text>",
  },
  category: Category.Fun,
})
export default class {
  static execute({ interaction }: Context) {
    const option = interaction.data?.options?.[0];

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return "Pomn amlgom pamram demcimr emn chememms";
    }

    // Enviam eml temxtom cheemsimfimcamdom
    // qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(option.value as string);
  }
}
