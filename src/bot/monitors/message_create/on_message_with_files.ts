import type { Monitor } from "../../types/monitor.ts";
import { cache } from "utils";

export default <Monitor<"messageCreate">> {
  name: "attachmentMonitor",
  type: "messageCreate",
  isGuildOnly: true,
  ignoreBots: false,
  execute(_bot, message) {
    const hasFile = message.attachments.length > 0;

    if (hasFile) {
      cache.lastAttachments.delete(message.channelId);
      cache.lastAttachments.set(message.channelId, message.attachments)
    }
  },
};
