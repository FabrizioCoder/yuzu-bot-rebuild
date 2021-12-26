import type { Database, Collection as MongoCollection } from "mongo";
import type { StarboardSchema } from "../models/starboard_model.ts";

type Collection<T = StarboardSchema> = MongoCollection<T>;

export function getCollection(db: Database) {
  return db.collection<StarboardSchema>("starboards");
}

export function getStarboard(collection: Collection, id: bigint) {
  return collection.findOne({ guildId: id.toString() }, { noCursorTimeout: false });
}

export function setStarboard(collection: Collection, id: bigint, channelId: bigint, emojiId?: bigint, count = 5) {
  return collection.insertOne({ count, guildId: id.toString(), channelId: channelId.toString(), emojiId: emojiId?.toString() ?? "⭐" });
}
export function editStarboard(collection: Collection, query: Partial<StarboardSchema>, data: Partial<StarboardSchema>) {
  return collection.updateOne(query, { $set: data });
}
