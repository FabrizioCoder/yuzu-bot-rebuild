import type { Command } from "../types/command.ts";
import { Category } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

export default <Command> {
  options: {
    isGuildOnly: false,
    information: {
      descr: "Invierte un texto",
      short: "Invierte un texto",
      usage: "<Input>",
    },
  },
  category: Category.Fun,
  data: {
    name: "reverse",
    description: "Invierte un texto",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        required: true,
        name: "input",
        description: "Reverse 🔄",
      },
    ],
  },
  async execute(_bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      return (option.value as string).split("").reverse().join("");
    }
  },
};
