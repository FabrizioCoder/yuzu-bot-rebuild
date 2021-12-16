import type { Monitor } from "../../types/monitor.ts";
import { cache } from "../../utils/mod.ts";

export default <Monitor<"messageCreate">> {
  name: "attachmentMonitor",
  type: "messageCreate",
  ignoreDM: false,
  ignoreBots: true,
  async execute(_bot, message) {
    const hasFile = message.attachments.length > 0;
    if (hasFile) {
      cache.lastAttachments.clear();
      cache.lastAttachments.set(message.channelId, message.attachments)
    }
  },
};
