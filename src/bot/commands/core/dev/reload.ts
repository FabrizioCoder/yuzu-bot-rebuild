import { type Context, Command } from "oasis";
import { cache, Category } from "utils";
import { upsertApplicationCommands } from "discordeno";

@Command({
  name: "reload",
  isGuildOnly: true,
  isAdminOnly: true,
  meta: {
    descr: "...",
    short: "..",
    usage: ".",
  },
  category: Category.Owner,
})
export default abstract class {
  static async execute({ bot }: Context<false>) {
    const commands = cache.slashCommands.map((c) => c.data);

    await upsertApplicationCommands(bot, commands);

    return `OK! Loading ⌛... \`${commands.map((c) => c.name).join(" ")}\``;
  }
}
