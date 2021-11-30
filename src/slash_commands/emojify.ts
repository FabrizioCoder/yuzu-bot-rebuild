import type { Command } from "../types/command.ts";
import { ApplicationCommandOptionTypes } from "../../deps.ts";
import { Division } from "../utils/mod.ts";

export default <Command> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Convierte un texto a emojis",
      short: "Reemplaza texto por emojis",
      usage: "<Texto>",
    },
  },
  division: Division.FUN,
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
  execute(_bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return "Escribe algo";
    }

    const MAPPING: Record<string, string> = {
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
    };

    // TODO: remove side effects
    "abcdefghijklmnopqrstuvwxyz".split("").forEach((c) => {
      MAPPING[c] = MAPPING[c.toUpperCase()] = ` :regional_indicator_${c}:`;
    });

    return (option.value as string).split("").map((c) => MAPPING[c] || c).join(
      "",
    );
  },
};
