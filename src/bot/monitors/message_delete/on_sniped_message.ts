import { createMonitor } from "oasis";
import { cache } from "utils";
import { MessageFlags } from "discordeno";

createMonitor({
  name: "messageSniper",
  event: "messageDelete",
  isGuildOnly: true,
  ignoreBots: true,
  execute(_bot, _payload, message) {
    if (message) {
      // TODO flags: SourceMessageDeleted
      if ((Number(message.flags) & MessageFlags.SourceMessageDeleted) === MessageFlags.SourceMessageDeleted) {
        // pass
      }
      cache.lastMessages.delete(message.channelId);
      cache.lastMessages.set(message.channelId, message);
    }
  },
});
