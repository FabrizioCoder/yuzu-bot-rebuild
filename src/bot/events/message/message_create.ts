import { cache, createEvent } from "oasis";
import { Configuration } from "utils";
import { sendMessage } from "discordeno";
import { error } from "logger";

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
          await sendMessage(bot, Configuration.logs.channelId, {
            content: `${e.cause}\n${e.stack}`,
          }).catch(error);
        }
      }
    });
  },
});
