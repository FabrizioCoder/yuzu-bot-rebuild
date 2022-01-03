import type { Event } from "../../types/event.ts";
import { cache, Configuration, logger } from "utils";
import { sendMessage } from "discordeno";

export default <Event> {
  name: "messageCreate",
  execute(bot, message) {
    cache.monitors
      .forEach(async (monitor) => {
        if (monitor.type !== "messageCreate") return;
        try {
          if (monitor.ignoreBots && message.isBot) {
            return;
          } else if (monitor.isGuildOnly && !message.guildId) {
            return;
          } else {
            await monitor.execute(bot, message);
          }
        } catch (e: unknown) {
          if (e instanceof Error) {
            await sendMessage(bot, Configuration.CHANNEL_ID, {
              content: `${e.cause}\n${e.stack}`,
            }).catch(logger.error);
          }
        }
      });
  },
};
