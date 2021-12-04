import type { Command } from "../types/command.ts";
import { cache, Division, Options } from "../utils/mod.ts";
import { upsertApplicationCommands } from "../../deps.ts";

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
  division: Division.OWNER,
  data: {
    name: "reload",
  },
  async execute(bot, message, { args }) {
    if (message.authorId !== Options.OWNER_ID) return;
    const commands = cache.slashCommands.map((c) => c.data);
    await upsertApplicationCommands(
      bot,
      commands,
      args.join(" ") ? BigInt(args.join(" ")) : undefined,
    );
    return `OK! Loading ⌛... \`${commands.map((c) => c.name).join(" ")}\``;
  },
};
