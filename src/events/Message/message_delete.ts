import type { Event } from "../../types/event.ts";
import type { DiscordenoMessage } from "../../../deps.ts";

import { cache } from "../../utils/mod.ts";
import { sendMessage } from "../../../deps.ts";

export default <Event<"messageDelete">> {
  name: "messageDelete",
  async execute(bot, payload) {
    // smol fix
    cache.monitors
      .filter((monitor) => monitor.kind === "messageDelete")
      .forEach(async (monitor) => {
        try {
          const message = <DiscordenoMessage> bot.cache.messages.get(
            payload.id,
          );
          if (!message) return;
          console.log(message);

          if (monitor.ignoreBots && message.isBot) return;
          await monitor.execute(bot, payload, message);
        } catch (error: unknown) {
          if (error instanceof Error) {
            sendMessage(bot, payload.channelId, error.message).catch(() => {});
          }
        }
      });
  },
};
