import type { Bson } from "mongo";

export interface StarboardSchema {
  guildId: Bson.Long;
  channelId: Bson.Long;
  emojiName?: string;
  count: number;
}
