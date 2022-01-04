import type { Command } from "../types/command.ts";
import { cache, Category } from "utils";
import { upsertApplicationCommands } from "discordeno";

export default <Command<false>> {
  options: {
    isGuildOnly: true,
    isAdminOnly: true,
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
  async execute({ bot }) {
    const commands = cache.slashCommands.map((c) => c.data);

    await upsertApplicationCommands(bot, commands);

    return `OK! Loading ⌛... \`${commands.map((c) => c.name).join(" ")}\``;
  },
};
