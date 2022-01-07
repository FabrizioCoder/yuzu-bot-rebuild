import type { Context } from "oasis";
import { Command } from "oasis";
import { cache, Category } from "utils";
import { upsertApplicationCommands, sendMessage } from "discordeno";

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
  static async execute({ bot, message }: Context<false>) {
    const commands = cache.slashCommands.map((c) => c.data);

    const file = new Blob([ Deno.inspect(commands, {  }) ]);

    await sendMessage(bot, message.channelId, {
      content: `OK! Loading ⌛... \`${commands.map((c) => c.name).join(" ")}\``,
      file: [{ blob: file, name: "Data.js" }],
    });

    const loaded = await upsertApplicationCommands(bot, commands);

    return loaded.map((cmd) => `\`${cmd.name}\``).join(" ");
  }
}
