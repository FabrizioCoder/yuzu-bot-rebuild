import type { Collection as MongoCollection, Database } from "mongo";
import type { LanguageSchema } from "../models/language_model.ts";
import type { Languages } from "../../utils/i18next.ts";

import { makeLong } from "../makeLong.ts";

type Collection<T = LanguageSchema> = MongoCollection<T>;

export function getCollection(db: Database) {
  return db.collection<LanguageSchema>("languages");
}

export function getLanguage(collection: Collection, id: bigint) {
  return collection.findOne(
    { guildId: makeLong(id) },
    {
      noCursorTimeout: false,
    }
  );
}

export function addLanguage(collection: Collection, id: bigint, language: Languages) {
  return collection.insertOne({ guildId: makeLong(id), locale: language });
}

export function editLanguage(collection: Collection, id: bigint, language: Languages) {
  return collection.updateOne(
    { guildId: makeLong(id) },
    {
      $set: { locale: language },
    }
  );
}

export function deleteLanguage(collection: Collection, id: bigint) {
  return collection.deleteOne({ guildId: makeLong(id) });
}
