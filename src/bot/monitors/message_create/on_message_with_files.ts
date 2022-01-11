import { createMonitor } from "oasis";
import { cache } from "utils";

createMonitor({
  name: "attachmentMonitor",
  event: "messageCreate",
  isGuildOnly: true,
  ignoreBots: false,
  execute(_bot, message) {
    const hasFile = message.attachments.length > 0;

    if (hasFile) {
      cache.lastAttachments.delete(message.channelId);
      cache.lastAttachments.set(message.channelId, message.attachments);
    }
  },
});
