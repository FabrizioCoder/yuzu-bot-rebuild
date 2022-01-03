import type { Monitor } from "../../types/monitor.ts";
import { cache } from "utils";

export default <Monitor> {
  name: "messageSniper",
  event: "messageDelete",
  isGuildOnly: true,
  ignoreBots: true,
  async execute(_bot, _payload, message) {
    if (message) {
      // TODO flags: SourceMessageDeleted
      cache.lastMessages.delete(message.channelId);
      cache.lastMessages.set(message.channelId, message);
    }
  },
};
