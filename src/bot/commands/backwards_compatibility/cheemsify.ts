import type { Command } from "../../types/command.ts";
import { Category, cheemsify } from "utils";

export default <Command<false>> {
  options: {
    isGuildOnly: false,
    isAdminOnly: false,
    information: {
      descr: "Conviertem un temxtom am imdiomam cheems",
      short: "Conviertem un temxtom am imdiomam cheems",
      usage: "<Text>",
    },
  },
  category: Category.Fun,
  data: {
    name: "cheemsify",
  },
  async execute(_bot, _message, { args }) {
    const option = args.join(" ");

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (!option) {
      return "Pomn amlgom pamram demcimr emn chememms";
    }

    //Enviam eml temxtom cheemsimfimcamdom y qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(option);
  },
};
