import type { Command } from "../types/command.ts";

import { ApplicationCommandOptionTypes } from "../../deps.ts";
import { Category, cheemsify } from "../utils/mod.ts";

export default <Command> {
  options: {
    guildOnly: false,
    information: {
      descr: "Conviertem un temxtom am imdiomam cheems",
      short: "Conviertem un temxtom am imdiomam cheems",
      usage: "<Text>",
    },
  },
  category: Category.Fun,
  data: {
    name: "cheemsify",
    description: "Conviertem un temxtom am imdiomam cheems",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        name: "input",
        required: true,
        description: "Temxto a comvermtirm a imdioma cheems",
      },
    ],
  },
  async execute(_bot, interaction) {
    const option = interaction.data?.options?.[0];

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return "Pomn amlgom pamram demcimr emn chememms";
    }

    // Enviam eml temxtom cheemsimfimcamdom
    // qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(option.value as string);
  },
};
