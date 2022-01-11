import { cache, createEvent } from "oasis";
import { Configuration, logger } from "utils";
import { sendMessage } from "discordeno";

createEvent({
  name: "messageCreate",
  execute(bot, message) {
    cache.monitors.forEach(async (monitor) => {
      if (monitor.event !== "messageCreate") return;
      try {
        if (monitor.ignoreBots && message.isBot) {
          return;
        } else if (monitor.isGuildOnly && !message.guildId) {
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
});
