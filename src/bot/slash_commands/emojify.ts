import type { Command } from "../types/command.ts";
import { Category, rangeChar } from "../../utils/mod.ts";
import { ApplicationCommandOptionTypes } from "../../../deps.ts";

export default <Command> {
  options: {
    guildOnly: false,
    information: {
      descr: "Convierte un texto a emojis",
      short: "Reemplaza texto por emojis",
      usage: "<Text>",
    },
  },
  category: Category.Fun,
  data: {
    name: "emojify",
    description: "Convierte un texto a emojis",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        name: "input",
        required: true,
        description: "Emojify 🔠",
      },
    ],
  },
  async execute(_bot, interaction) {
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
};
