import type { Command } from "../../types/command.ts";

import { cheemsify, Division } from "../../utils/mod.ts";

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Conviertem un temxtom am imdiomam cheems",
      short: "Conviertem un temxtom am imdiomam cheems",
      usage: "<Text>",
    },
  },
  division: Division.FUN,
  data: {
    name: "cheemsify",
  },
  execute(_bot, _message, { args }) {
    const option = args.join(" ");

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (!option) {
      return "Pomn amlgom pamram demcimr emn chememms";
    }

    //Enviam eml temxtom cheemsimfimcamdom y qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(option);
  },
};
