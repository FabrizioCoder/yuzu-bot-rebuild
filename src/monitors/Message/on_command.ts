import type { Monitor } from "../../types/monitor.ts";

import { cache, Options } from "../../utils/mod.ts";
import { sendMessage } from "../../../deps.ts";

export default <Monitor<"messageCreate">> {
  name: "commandMonitor",
  kind: "messageCreate",
  ignoreDM: true,
  ignoreBots: true,
  async execute(bot, message) {
    const prefix = Options.PREFIX;
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
      const output = await command.execute(bot, message, args);

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
