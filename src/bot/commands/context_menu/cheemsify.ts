import { createCommand, MessageApplicationCommandBuilder } from "oasis";
import { Category, cheemsify } from "utils";

createCommand({
  meta: {
    descr: "Click y conviertem un temxtom am imdiomam cheems",
    short: "Click y conviertem un temxtom am imdiomam cheems",
    usage: "<Input>",
  },
  category: Category.Fun,
  execute({ interaction }) {
    const message = interaction.data?.resolved?.messages?.first();

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (!message) {
      return "Pomn amlgom pamram demcimr emn chememms";
    }

    // Enviam eml temxtom cheemsimfimcamdom
    // qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(message.content);
  },
  data: new MessageApplicationCommandBuilder().setName("cheemsify").toJSON(),
});
