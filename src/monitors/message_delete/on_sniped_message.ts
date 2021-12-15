import type { Monitor } from "../../types/monitor.ts";
import { cache } from "../../utils/mod.ts";

export default <Monitor<"messageDelete">> {
  name: "messageSniper",
  type: "messageDelete",
  ignoreDM: true,
  ignoreBots: true,
  async execute(_bot, _payload, message) {
    if (!message) return;
    // TODO flags: SourceMessageDeleted
    cache.lastMessages.delete(message.channelId);
    cache.lastMessages.set(message.channelId, message);
  },
};
