import { CommandoCache, createMessageCommand } from "oasis/commando";
import { Category } from "utils";
import { sendMessage, upsertApplicationCommands } from "discordeno";

createMessageCommand({
  names: ["reload"],
  isGuildOnly: true,
  isAdminOnly: true,
  meta: {
    descr: "...",
    usage: ".",
  },
  category: Category.Owner,
  async execute({ bot, message }) {
    const commands = CommandoCache.slashCommands.map((c) => c.data);

    const file = new Blob([Deno.inspect(commands, {})]);

    await sendMessage(bot, message.channelId, {
      content: `OK! Loading ⌛... \`${commands.map((c) => c.name).join(" ")}\``,
      file: [{ blob: file, name: "Data.js" }],
    });

    const loaded = await upsertApplicationCommands(bot, commands);

    return loaded.map((cmd) => `\`${cmd.name}\``).join(" ");
  },
});
