import type { Command } from "../../types/command.ts";

import { Division } from "../../utils/mod.ts";
import { ApplicationCommandTypes } from "../../../deps.ts";

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
  async execute(bot, interaction) {
    console.log(bot, interaction);
  },
};
