import { CommandoCache, createEvent } from "oasis/commando";
import { Configuration } from "utils";
import { sendMessage } from "discordeno";
import { error } from "logger";

createEvent({
  name: "messageDelete",
  execute(bot, payload, message) {
    CommandoCache.monitors.forEach(async (monitor) => {
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
