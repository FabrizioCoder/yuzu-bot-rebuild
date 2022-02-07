import type { Collection as MongoCollection, Database } from "mongo";
import type { StarboardSchema } from "../models/starboard_model.ts";

import { makeLong } from "../makeLong.ts";

type Collection<T = StarboardSchema> = MongoCollection<T>;

export function getCollection(db: Database) {
  return db.collection<StarboardSchema>("starboards");
}

export function getStarboard(collection: Collection, id: bigint) {
  return collection.findOne(
    { guildId: makeLong(id) },
    {
      noCursorTimeout: false,
    }
  );
}

export function setStarboard(collection: Collection, id: bigint, channelId: bigint, emojiName?: string, count = 5) {
  return collection.insertOne({
    count,
    guildId: makeLong(id),
    channelId: makeLong(channelId),
    emojiName,
  });
}
export function editStarboard(
  collection: Collection,
  id: bigint,
  data: Omit<Partial<StarboardSchema>, "guildId" | "channelId"> & Partial<{ guildId: bigint; channelId: bigint }>
) {
  return collection.updateOne(
    { guildId: makeLong(id) },
    {
      $set: {
        guildId: data.guildId ? makeLong(data.guildId) : undefined,
        channelId: data.channelId ? makeLong(data.channelId) : undefined,
        emojiName: data.emojiName,
        count: data.count,
      },
    }
  );
}
