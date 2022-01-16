import type { Bson } from "mongo";
import type { Languages } from "../../utils/i18next.ts";

export interface LanguageSchema {
  guildId: Bson.Long;
  locale: Languages;
}
