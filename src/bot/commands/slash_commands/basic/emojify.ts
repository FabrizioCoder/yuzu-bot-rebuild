import { createCommand, ChatInputApplicationCommandBuilder } from "oasis";
import { Category, rangeChar } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

createCommand({
  meta: {
    descr: "Convierte un texto a emojis",
    short: "Reemplaza texto por emojis",
    usage: "<Text>",
  },
  category: Category.Fun,
  execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return "Escribe algo";
    }

    const mapping: Record<string, string> = {
      " ": "   ",
      "0": ":zero:",
      "1": ":one:",
      "2": ":two:",
      "3": ":three:",
      "4": ":four:",
      "5": ":five:",
      "6": ":six:",
      "7": ":seven:",
      "8": ":eight:",
      "9": ":nine:",
      "!": ":grey_exclamation:",
      "?": ":grey_question:",
      "#": ":hash:",
      "*": ":asterisk:",
      ...Object.fromEntries(rangeChar("a", "z").map((c) => [c, `:regional_indicator_${c}: `])),
    };

    return (option.value as string)
      .split("")
      .map((c) => (c.toLowerCase() in mapping ? mapping[c.toLowerCase()] : c))
      .join("");
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("emojify")
    .setDescription("Convierte un texto a emojis")
    .addStringOption((o) => o.setName("input").setDescription("Text to Emojify").setRequired(true))
    .toJSON(),
});
