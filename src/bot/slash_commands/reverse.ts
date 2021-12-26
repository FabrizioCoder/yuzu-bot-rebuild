import type { Command } from "../types/command.ts";
import { Category } from "../../utils/mod.ts";
import { ApplicationCommandOptionTypes } from "discordeno";

export default <Command> {
  options: {
    guildOnly: false,
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
  async execute(_, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.String) {
      return (option.value as string).split("").reverse().join("");
    }
  },
};
