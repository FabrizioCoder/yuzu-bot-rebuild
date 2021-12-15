import type { Command } from "../../types/command.ts";

import { Division } from "../../utils/mod.ts";
import { ApplicationCommandTypes } from "../../../deps.ts";

import {
  SafetyLevels,
  search,
} from "https://deno.land/x/ddgimages@v1.1.1/mod.ts";

export default <Command> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "...",
      short: "...",
      usage: "<Input>",
    },
  },
  disabled: true,
  division: Division.FUN,
  data: {
    type: ApplicationCommandTypes.Message,
    name: "search",
  },
  async execute(_bot, interaction) {
    const message = interaction.data?.resolved?.messages?.first();

    if (message) {
      const [result] = await search(message.content, SafetyLevels.STRICT);
      return result.image;
    }
  },
};
