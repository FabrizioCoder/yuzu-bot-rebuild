import type { Bson } from "mongo";

export interface TagSchema {
  guildId: Bson.Long;
  userId: Bson.Long;
  name: string;
  content: string;
  attachments: string[];
  isGlobal: boolean;
  isNsfw: boolean;
}
