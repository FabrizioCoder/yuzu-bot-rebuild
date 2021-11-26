import type { Monitor } from "../../types/monitor.ts";

import { cache } from "../../utils/mod.ts";

export default <Monitor<"messageDelete">> {
  name: "messageSniper",
  kind: "messageDelete",
  ignoreDM: true,
  ignoreBots: true,
  async execute(_bot, _payload, message) {
    if (!message) return;
    // TODO flags: SourceMessageDeleted
    cache.lastMessages.set(message.id, message);
  },
};
