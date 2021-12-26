import type { Command } from "../../types/command.ts";
import { Category } from "utils";
import { ApplicationCommandTypes } from "discordeno";
import { SafetyLevels, search } from "https://deno.land/x/ddgimages@v1.1.1/mod.ts";

export default <Command> {
  options: {
    guildOnly: false,
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
  async execute(_bot, interaction) {
    const message = interaction.data?.resolved?.messages?.first();

    if (message) {
      const [result] = await search(message.content, SafetyLevels.STRICT);

      if (result) {
        return result.image;
      }
    }
  },
};
