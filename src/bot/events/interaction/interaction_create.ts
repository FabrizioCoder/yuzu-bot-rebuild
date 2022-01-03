import type { Event } from "../../types/event.ts";
import { cache, Configuration, logger } from "utils";
import { sendMessage } from "discordeno";

export default <Event> {
  name: "interactionCreate",
  execute(bot, interaction) {
    cache.monitors
      .forEach(async (monitor) => {
        if (monitor.event !== "interactionCreate") return;
        try {
          if (monitor.ignoreBots && interaction.user.bot) {
            return;
          } else if (monitor.isGuildOnly && !interaction.guildId) {
            return;
          } else {
            await monitor.execute(bot, interaction);
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
