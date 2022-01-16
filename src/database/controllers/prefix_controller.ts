import type { Database, Collection as MongoCollection } from "mongo";
import type { PrefixSchema } from "../models/prefix_model.ts";

import { makeLong } from "../makeLong.ts";

type Collection<T = PrefixSchema> = MongoCollection<T>;

export function getCollection(db: Database) {
  return db.collection<PrefixSchema>("prefixes");
}

export function getPrefix(collection: Collection, id: bigint) {
  return collection.findOne({ guildId: makeLong(id) }, { noCursorTimeout: false });
}

export function addPrefix(collection: Collection, id: bigint, prefix: string) {
  return collection.insertOne({ guildId: makeLong(id), prefix });
}

export function editPrefix(collection: Collection, id: bigint, prefix: string) {
  return collection.updateOne({ guildId: makeLong(id) }, { $set: { prefix } });
}

export function deletePrefix(collection: Collection, id: bigint) {
  return collection.deleteOne({ guildId: makeLong(id) });
}
