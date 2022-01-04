import type { Command } from "../../types/command.ts";
import { Category } from "utils";
import { ApplicationCommandTypes } from "discordeno";
import { SafetyLevels, search } from "images";

export default <Command> {
  options: {
    isGuildOnly: false,
    information: {
      descr: "Click encima de un mensaje para buscar una imagen",
      short: "Click encima de un mensaje",
      usage: "<Input>",
    },
  },
  category: Category.Util,
  data: {
    type: ApplicationCommandTypes.Message,
    name: "search",
  },
  async execute({ interaction }) {
    const message = interaction.data?.resolved?.messages?.first();

    if (message) {
      const [result] = await search(message.content, SafetyLevels.STRICT);

      if (result) {
        return result.image;
      }
    }
  },
};
