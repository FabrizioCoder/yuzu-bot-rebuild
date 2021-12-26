import type { Database, Collection as MongoCollection } from "mongo";
import type { PrefixSchema } from "../models/prefix_model.ts";

type Collection<T = PrefixSchema> = MongoCollection<T>;

export function getCollection(db: Database) {
  return db.collection<PrefixSchema>("prefixes");
}

export function getPrefix(collection: Collection, id: bigint) {
  return collection.findOne({ server: id.toString() }, {
    noCursorTimeout: false,
  });
}

export function addPrefix(collection: Collection, id: bigint, prefix: string) {
  return collection.insertOne({ server: id.toString(), prefix });
}

export function editPrefix(collection: Collection, id: bigint, prefix: string) {
  return collection.updateOne({ server: id.toString() }, { $set: { prefix } });
}

export function deletePrefix(collection: Collection, id: bigint) {
  return collection.deleteOne({ server: id.toString() });
}
