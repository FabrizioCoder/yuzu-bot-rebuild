import type { Command } from "../types/command.ts";
import { cache, Division, Options } from "../utils/mod.ts";
import { upsertApplicationCommands } from "../../deps.ts";

export default <Command<false>> {
  options: {
    guildOnly: true,
    adminOnly: true,
  },
  division: Division.OWNER,
  data: "reload",
  async execute(bot, message) {
    if (message.authorId !== Options.OWNER_ID) return;
    const commands = cache.slashCommands.map((c) => c.data);
    await upsertApplicationCommands(bot, commands, Options.GUILD_ID);
    return `OK! Loading ⌛... \`${commands.map((c) => c.name).join(" ")}\``;
  },
};
