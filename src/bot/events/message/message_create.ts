import type { Event } from "../../types/event.ts";
import { cache, Configuration, logger } from "../../../utils/mod.ts";
import { sendMessage } from "discordeno";

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
          if (e instanceof Error) {
            await sendMessage(bot, Configuration.CHANNEL_ID, `${e.cause}\n${e.stack}`).catch(logger.error);
          }
        }
      });
  },
};
