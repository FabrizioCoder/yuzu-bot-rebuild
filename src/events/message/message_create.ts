import type { Event } from "../../types/event.ts";
import { cache, Options } from "../../utils/mod.ts";
import { sendMessage } from "../../../deps.ts";

export default <Event<"messageCreate">> {
  name: "messageCreate",
  execute(bot, message) {
    cache.monitors
      .filter((monitor) => monitor.type === "messageCreate")
      .forEach(async (monitor) => {
        try {
          if (monitor.ignoreBots && message.isBot) {
            return;
          }

          await monitor.execute(bot, message);
        } catch (error: unknown) {
          if (!(error instanceof Error)) {
            return;
          }
          sendMessage(bot, Options.CHANNEL_ID, error.message)
            .catch(console.error);
        }
      });
  },
};
