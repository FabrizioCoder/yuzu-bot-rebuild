import { cache, createEvent } from "oasis";
import { Configuration } from "utils";
import { sendMessage } from "discordeno";
import { error } from "logger";

createEvent({
  name: "messageDelete",
  execute(bot, payload, message) {
    cache.monitors.forEach(async (monitor) => {
      if (monitor.event !== "messageDelete") return;
      try {
        if (monitor.ignoreBots && message?.isBot) {
          return;
        } else if (monitor.isGuildOnly && !message?.guildId) {
          return;
        } else {
          await monitor.execute(bot, payload, message);
        }
      } catch (e) {
        if (e instanceof Error) {
          await sendMessage(bot, Configuration.logs.channelId, {
            content: `${e.cause}\n${e.stack}`,
          }).catch(error);
        }
      }
    });
  },
});
