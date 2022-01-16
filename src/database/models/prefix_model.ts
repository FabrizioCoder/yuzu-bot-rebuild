import type { Bson } from "mongo";

export interface PrefixSchema {
  guildId: Bson.Long;
  prefix: string;
}
