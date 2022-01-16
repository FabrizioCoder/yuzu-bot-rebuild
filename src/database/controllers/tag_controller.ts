import type { Database, Collection as MongoCollection } from "mongo";
import type { TagSchema } from "../models/tag_model.ts";

import { makeLong } from "../makeLong.ts";

type Collection<T = TagSchema> = MongoCollection<T>;

export function getCollection(db: Database) {
  return db.collection<TagSchema>("tags");
}

export function getTag(collection: Collection, name: string, id?: bigint) {
  return id
    ? collection.findOne(
        { name: name, guildId: makeLong(id) },
        {
          noCursorTimeout: false,
        }
      )
    : collection.findOne(
        { name: name, global: true },
        {
          noCursorTimeout: false,
        }
      );
}

export function findTag(collection: Collection, id: bigint, userId: bigint) {
  return collection
    .find(
      {
        guildId: makeLong(id),
        userId: makeLong(userId),
      },
      {
        noCursorTimeout: false,
      }
    )
    .toArray();
}

export function addTag(
  collection: Collection,
  id: bigint,
  userId: bigint,
  {
    name,
    content,
    attachments,
  }: {
    name: string;
    content?: string;
    attachments?: string[];
  }
) {
  if (!content && !attachments) return;
  return collection.insertOne({
    guildId: makeLong(id),
    userId: makeLong(userId),
    name: name,
    content: content ?? "",
    attachments: attachments ?? [],
    isGlobal: false,
    isNsfw: false,
  });
}

export function removeTag(collection: Collection, id: bigint, userId: bigint, name: string) {
  return collection.deleteOne({
    guildId: makeLong(id),
    user: makeLong(userId),
    name,
  });
}

export function editTag(
  collection: Collection,
  query: { guildId: bigint; userId: bigint; name: string },
  {
    name,
    content,
    guildId,
    userId,
    attachments,
    isGlobal,
    isNsfw,
  }: Omit<Partial<TagSchema>, "guildId" | "userId"> & Partial<{ guildId: bigint; userId: bigint }>
) {
  return collection.updateOne(
    { guildId: makeLong(query.guildId), userId: makeLong(query.userId) },
    {
      $set: {
        name,
        content,
        guildId: guildId ? makeLong(guildId) : undefined,
        userId: userId ? makeLong(userId) : undefined,
        attachments,
        isGlobal,
        isNsfw,
      },
    }
  );
}

export function passTag(
  collection: Collection,
  id: bigint,
  userId: bigint,
  data: Pick<TagSchema, "isGlobal" | "isNsfw"> & { guildId: bigint; userId: bigint }
) {
  return collection.updateOne(
    { guildId: makeLong(data.guildId), userId: makeLong(userId), isGlobal: data.isGlobal, isNsfw: data.isNsfw },
    {
      $set: { guildId: makeLong(id), userId: makeLong(userId) },
    }
  );
}
