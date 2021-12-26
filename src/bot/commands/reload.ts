import type { Command } from "../types/command.ts";
import { cache, Category } from "../../utils/mod.ts";
import { upsertApplicationCommands } from "discordeno";

export default <Command<false>> {
  options: {
    guildOnly: true,
    adminOnly: true,
    information: {
      descr: "...",
      short: "..",
      usage: ".",
    },
  },
  category: Category.Owner,
  data: {
    name: "reload",
  },
  async execute(bot) {
    const commands = cache.slashCommands.map((c) => c.data);

    await upsertApplicationCommands(bot, commands);

    return `OK! Loading ⌛... \`${commands.map((c) => c.name).join(" ")}\``;
  },
};
