import type { Database, MongoCollection } from "../../../deps.ts";
import type { TagSchema } from "../models/tag_model.ts";

type Collection<T = TagSchema> = MongoCollection<T>;

export function getCollection(db: Database) {
  return db.collection<TagSchema>("tags");
}

export function getTag(collection: Collection, name: string, id?: bigint) {
  return id
    ? collection.findOne({ name: name, server: id.toString() }, {
      noCursorTimeout: false,
    })
    : collection.findOne({ name: name, global: true }, {
      noCursorTimeout: false,
    });
}

export function findTag(collection: Collection, id: bigint, userId: bigint) {
  return collection.find({
    server: id.toString(),
    user: userId.toString(),
  }, {
    noCursorTimeout: false,
  }).toArray();
}

export function addTag(
  collection: Collection,
  id: bigint,
  userId: bigint,
  { name, content, attachments }: {
    name: string;
    content?: string;
    attachments?: string[];
  },
) {
  if (!content && !attachments) return;
  return collection.insertOne({
    server: id.toString(),
    user: userId.toString(),
    name: name,
    content: content ?? "",
    attachments: attachments ?? [],
    global: false,
    nsfw: false,
  });
}

export function removeTag(
  collection: Collection,
  id: bigint,
  userId: bigint,
  name: string,
) {
  return collection.deleteOne({
    server: id.toString(),
    user: userId.toString(),
    name,
  });
}

export function editTag(
  collection: Collection,
  data: Pick<TagSchema, "server" | "user" | "name">,
  query: Partial<TagSchema>,
) {
  return collection.updateOne(data, { $set: query });
}

export function passTag(
  collection: Collection,
  id: bigint,
  userId: bigint,
  data: Pick<TagSchema, "server" | "user" | "global" | "nsfw">,
) {
  return collection.updateOne(data, {
    $set: { server: id.toString(), user: userId.toString() },
  });
}
