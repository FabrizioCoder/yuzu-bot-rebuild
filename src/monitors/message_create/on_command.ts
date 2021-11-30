import type { Monitor } from "../../types/monitor.ts";
import type { PrefixSchema } from "../../database/models/prefix_model.ts";
import { cache, Options } from "../../utils/mod.ts";
import { getPrefix } from "../../database/controllers/prefix_controller.ts";
import { db } from "../../database/db.ts";
import { sendMessage } from "../../../deps.ts";

export default <Monitor<"messageCreate">> {
  name: "commandMonitor",
  kind: "messageCreate",
  ignoreDM: true,
  ignoreBots: true,
  async execute(bot, message) {
    // TODO: make this more readable
    const prefix = message.guildId
      ? db
        ? (await getPrefix(
          db.collection<PrefixSchema>("prefixes"),
          message.guildId,
        ))?.prefix ?? Options.PREFIX
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
      sendMessage(
        bot,
        message.channelId,
        "Ese comando no existe! 🔒",
      ).catch(() => {});
      return;
    }

    try {
      const output = await command.execute(bot, message, { args });

      if (!output) return;

      if (typeof output === "string") {
        await sendMessage(bot, message.channelId, { content: output });
        return;
      }
      await sendMessage(bot, message.channelId, { embeds: [output] });
    } catch (error: unknown) {
      if (!(error instanceof Error)) return;
      sendMessage(
        bot,
        message.channelId,
        `Error: ${error.message}`,
      ).catch(() => {});
    }
  },
};
