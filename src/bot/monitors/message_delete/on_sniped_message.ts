import { createMonitor } from "oasis";
import { cache } from "utils";

createMonitor({
  name: "messageSniper",
  event: "messageDelete",
  isGuildOnly: true,
  ignoreBots: true,
  execute(_bot, _payload, message) {
    if (message) {
      // TODO flags: SourceMessageDeleted
      cache.lastMessages.delete(message.channelId);
      cache.lastMessages.set(message.channelId, message);
    }
  },
});
