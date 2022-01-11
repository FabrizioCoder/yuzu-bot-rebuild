import { createMessageCommand } from "oasis";
import { Category, cheemsify } from "utils";

createMessageCommand({
  name: "cheemsify",
  meta: {
    descr: "Conviertem un temxtom am imdiomam cheems",
    short: "Conviertem un temxtom am imdiomam cheems",
    usage: "<Text>",
  },
  category: Category.Fun,
  execute({ args }) {
    const option = args.args.join(" ");

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (!option) {
      return "Pomn amlgom pamram demcimr emn chememms";
    }

    // Enviam eml temxtom cheemsimfimcamdom
    // qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(option);
  },
});
