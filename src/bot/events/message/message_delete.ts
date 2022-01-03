import type { Event } from "../../types/event.ts";
import { cache, Configuration, logger } from "utils";
import { sendMessage } from "discordeno";

export default <Event> {
  name: "messageDelete",
  execute(bot, _payload, message) {
    cache.monitors
      .forEach(async (monitor) => {
        if (monitor.type !== "messageDelete") return;
        try {
          if (monitor.ignoreBots && message?.isBot) {
            return;
          } else if (monitor.isGuildOnly && !message?.guildId) {
            return;
          } else {
            await monitor.execute(bot, message);
          }
        } catch (e) {
          if (e instanceof Error) {
            await sendMessage(bot, Configuration.CHANNEL_ID, {
              content: `${e.cause}\n${e.stack}`,
            }).catch(logger.error);
          }
        }
      });
  },
};
