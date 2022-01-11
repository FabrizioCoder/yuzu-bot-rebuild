import { cache, createMessageCommand } from "oasis";
import { Category } from "utils";
import { upsertApplicationCommands, sendMessage } from "discordeno";

createMessageCommand({
  name: "reload",
  isGuildOnly: true,
  isAdminOnly: true,
  meta: {
    descr: "...",
    short: "..",
    usage: ".",
  },
  category: Category.Owner,
  async execute({ bot, message }) {
    const commands = cache.slashCommands.map((c) => c.data);

    const file = new Blob([Deno.inspect(commands, {})]);

    await sendMessage(bot, message.channelId, {
      content: `OK! Loading ⌛... \`${commands.map((c) => c.name).join(" ")}\``,
      file: [{ blob: file, name: "Data.js" }],
    });

    const loaded = await upsertApplicationCommands(bot, commands);

    return loaded.map((cmd) => `\`${cmd.name}\``).join(" ");
  },
});
