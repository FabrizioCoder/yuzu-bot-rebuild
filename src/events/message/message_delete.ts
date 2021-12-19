import type { Event } from "../../types/event.ts";
import { cache, Configuration } from "../../utils/mod.ts";
import { sendMessage } from "../../../deps.ts";

export default <Event<"messageDelete">> {
  name: "messageDelete",
  execute(bot, payload, message) {
    cache.monitors
      .filter((monitor) => monitor.type === "messageDelete")
      .forEach(async (monitor) => {
        try {
          if (!message) return;
          if (monitor.ignoreBots && message.isBot) return;
          await monitor.execute(bot, payload, message);
        } catch (e) {
          if (e instanceof Error) {
            await sendMessage(bot, Configuration.CHANNEL_ID, `${e.cause}\n${e.stack}`).catch(console.error);
          }
        }
      });
  },
};
