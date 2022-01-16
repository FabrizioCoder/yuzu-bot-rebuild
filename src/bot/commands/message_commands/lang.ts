import { createMessageCommand } from "oasis";
import { Category } from "utils";
import { addLanguage, editLanguage, getLanguage, getCollection } from "database/controllers/language_controller.ts";
import { db } from "database/db";

createMessageCommand({
  names: ["lang", "setlang"],
  category: Category.Info,
  isGuildOnly: true,
  meta: {
    descr: "Set a language",
    short: "Set a language",
    usage: "lang [es | en]",
  },
  async execute({ message, args: { args } }) {
    if (!db) return;

    const input = args[0];

    const currentLanguage = await getLanguage(getCollection(db), message.guildId!);

    if (!input && currentLanguage) {
      return `The current language is: ${currentLanguage.locale}`;
    }

    const isLanguageValid = input === "es_MX" || input === "en_US";

    if (!isLanguageValid) {
      return "The only available languages are 'es_MX' and 'en_US'";
    }

    if (!currentLanguage) {
      await addLanguage(getCollection(db), message.guildId!, input);

      const language = await getLanguage(getCollection(db), message.guildId!);

      return `Ok! the new language is ${language?.locale}`;
    } else {
      await editLanguage(getCollection(db), message.guildId!, input);

      const language = await getLanguage(getCollection(db), message.guildId!);

      return `Ok! the new language is ${language?.locale}`;
    }
  },
});
