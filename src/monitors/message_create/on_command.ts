import type { Monitor } from "../../types/monitor.ts";
import type { BotWithCache } from "../../../deps.ts";
import { cache, Options } from "../../utils/mod.ts";
import { getCollection, getPrefix } from "../../database/controllers/prefix_controller.ts";
import { db } from "../../database/db.ts";
import { sendMessage } from "../../../deps.ts";

export default <Monitor<"messageCreate">>{
  name: "commandMonitor",
  type: "messageCreate",
  ignoreDM: true,
  ignoreBots: true,
  async execute(bot, message) {
    const prefix = message.guildId
      ? db
        ? (await getPrefix(getCollection(db), message.guildId))?.prefix ?? Options.PREFIX
        : Options.PREFIX
      : Options.PREFIX;

    const args = message.content.slice(prefix.length).trim().split(/\s+/gm);
    const name = args.shift()?.toLowerCase();

    if (!message.content.startsWith(prefix)) {
      return;
    }

    if (!name) return;

    const command = cache.commands.get(name);

    if (!command) {
      await sendMessage(bot, message.channelId, "Ese comando no existe! 🔒");
      return;
    }

    await sendMessage(bot, Options.CHANNEL_ID, {
      content: `Comando ${command.data.name} ejecutado por ${message.tag}`,
    });

    const output = await command.execute(bot as BotWithCache, message, { args, prefix });

    if (!output) {
      return;
    }

    if (typeof output === "string") {
      await sendMessage(bot, message.channelId, {
        content: output,
        allowedMentions: { users: [], roles: [] },
      });
      return;
    }
    await sendMessage(bot, message.channelId, { embeds: [output] });
  },
};
