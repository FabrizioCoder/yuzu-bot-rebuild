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
        } catch (e: unknown) {
          await sendMessage(bot, Options.CHANNEL_ID, `Error: ${JSON.stringify(e)}`)
            .catch(console.error);
        }
      });
  },
};
