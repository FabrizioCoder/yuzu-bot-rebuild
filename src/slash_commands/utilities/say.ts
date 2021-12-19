import type { Command } from "../../types/command.ts";

import { Category, isInvite } from "../../utils/mod.ts";
import { ApplicationCommandOptionTypes } from "../../../deps.ts";

export default <Command> {
  options: {
    guildOnly: false,
    information: {
      descr: "Hace que el bot diga algo muy malo",
      short: "Escribir el mensaje del bot",
      usage: "<Input>",
    },
  },
  category: Category.Fun,
  data: {
    name: "say",
    description: "Hace que el bot diga algo muy malo",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        required: true,
        name: "input",
        description: "📝📝📝📝📝",
      },
    ],
  },
  async execute(_bot, interaction) {
    const option = interaction.data?.options?.[0];

    // type guard
    if (option?.type !== ApplicationCommandOptionTypes.String) return;

    if (typeof option.value === "string") {
      if (isInvite(option.value)) return "No puedo enviar invites";

      return option.value;
    }
  },
};
