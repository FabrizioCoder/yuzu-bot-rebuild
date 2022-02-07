import { CommandoCache, createEvent } from "oasis/commando";
import { Configuration } from "utils";
import { sendMessage } from "discordeno";
import { error } from "logger";

createEvent({
  name: "interactionCreate",
  execute(bot, interaction) {
    CommandoCache.monitors.forEach(async (monitor) => {
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
          await sendMessage(bot, Configuration.logs.channelId, {
            content: `${e.cause}\n${e.stack}`,
          }).catch(error);
        }
      }
    });
  },
});
