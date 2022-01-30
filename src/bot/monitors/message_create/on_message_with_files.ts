import { createMonitor } from "oasis";
import { cache } from "utils";

createMonitor({
  name: "attachmentMonitor",
  event: "messageCreate",
  isGuildOnly: true,
  ignoreBots: false,
  execute(_bot, message) {
    const hasFile = message.attachments.length > 0 || message.embeds.length > 0;

    if (hasFile) {
      const files = message.attachments.map((a) => a.url);
      const embedFiles = message.embeds.map((e) => e.image?.url).filter(Boolean) as string[];

      cache.lastAttachments.delete(message.channelId);
      cache.lastAttachments.set(
        message.channelId,
        [...files, ...embedFiles]
      );
    }
  },
});
