import {
  createCommand,
  createMessageCommand,
  ChatInputApplicationCommandBuilder,
  MessageApplicationCommandBuilder,
} from "oasis";
import { Category, cheemsify } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

createCommand({
  meta: {
    descr: "commands:cheemsify:DESCRIPTION",
    usage: "commands:cheemsify:USAGE",
  },
  category: Category.Fun,
  translated: true,
  execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    // Enviam eml temxtom cheemsimfimcamdom
    // qumimtam lams memncimomnems pamram emvimtamr qumem memncimomnemn am umsumamrimoms
    return cheemsify(option.value as string);
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("cheemsify")
    .setDescription("Conviertem un temxtom am imdiomam cheems")
    .addStringOption((o) =>
      o.setName("input").setDescription("Temxto a comvermtirm a imdioma cheems").setRequired(true)
    )
    .toJSON(),
});

createMessageCommand({
  names: ["cheemsify", "cheemsificar"],
  meta: {
    descr: "commands:cheemsify:DESCRIPTION",
    usage: "commands:cheemsify:USAGE",
  },
  category: Category.Fun,
  translated: true,
  execute({ args }) {
    const option = args.args.join(" ");

    // Remtomrnam umn memnsamjem aml demtemctamr qumem nom sem ham pumemstom namdam
    if (!option) {
      return "commands:cheemsify:ON_MISSING_TEXT";
    }

    return cheemsify(option);
  },
});

createCommand({
  meta: {
    descr: "commands:cheems:DESCRIPTION",
    usage: "commands:cheems:USAGE",
  },
  category: Category.Fun,
  translated: true,
  execute({ interaction }) {
    const message = interaction.data?.resolved?.messages?.first();

    if (!message) {
      return "commands:cheems:ON_MISSING_TEXT";
    }

    return cheemsify(message.content);
  },
  data: new MessageApplicationCommandBuilder().setName("cheems").toJSON(),
});
