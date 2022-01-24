import { cache, createEvent } from "oasis";
import { Configuration, logger } from "utils";
import { sendMessage } from "discordeno";

createEvent({
  name: "interactionCreate",
  execute(bot, interaction) {
    cache.monitors.forEach(async (monitor) => {
      if (monitor.event !== "interactionCreate") return;
      try {
        if (monitor.ignoreBots && interaction.user.bot) {
          return;
        } else if (monitor.isGuildOnly && !interaction.guildId) {
          return;
        } else {
          await monitor.execute(bot, interaction);
        }
      } catch (e) {
        if (e instanceof Error) {
          await sendMessage(bot, Configuration.channelId, {
            content: `${e.cause}\n${e.stack}`,
          }).catch(logger.error);
        }
      }
    });
  },
});
