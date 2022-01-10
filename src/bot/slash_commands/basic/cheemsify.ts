import { createCommand, ChatInputApplicationCommandBuilder } from "oasis";
import { Category, cheemsify } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

export default createCommand({
  meta: {
    descr: "Conviertem un temxtom am imdiomam cheems",
    short: "Conviertem un temxtom am imdiomam cheems",
    usage: "<Text>",
  },
  category: Category.Fun,
  execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return "Pomn amlgom pamram demcimr emn chememms";
    }

    // Enviam eml temxtom cheemsimfimcamdom
    // qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(option.value as string);
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("cheemsify")
    .setDescription("Conviertem un temxtom am imdiomam cheems")
    .addStringOption((o) => o.setName("input").setDescription("Temxto a comvermtirm a imdioma cheems").setRequired(true))
    .toJSON(),
});
