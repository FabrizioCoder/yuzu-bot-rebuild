import type { Event } from "../../types/event.ts";
import { cache, Options } from "../../utils/mod.ts";
import { sendMessage } from "../../../deps.ts";

export default <Event<"interactionCreate">> {
  name: "interactionCreate",
  execute(bot, interaction) {
    cache.monitors
      .filter((monitor) => monitor.type === "interactionCreate")
      .forEach(async (monitor) => {
        try {
          if (monitor.ignoreBots && interaction.user.bot) {
            return;
          }
          await monitor.execute(bot, interaction);
        } catch (e: unknown) {
          if (e instanceof Error) {
            await sendMessage(bot, Options.CHANNEL_ID, `${e.cause}\n${e.stack}`).catch(console.error);
          }
        }
      });
  },
};
