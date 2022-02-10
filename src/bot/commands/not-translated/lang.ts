import { createMessageCommand } from "oasis/commando";
import { Category } from "utils";
import { addLanguage, editLanguage, getCollection, getLanguage } from "database/controllers/language_controller.ts";
import { db } from "database/db";
import { getGuild, getMember } from "discordeno";
import { hasGuildPermissions } from "permissions_plugin";

createMessageCommand({
  names: ["lang", "setlang"],
  category: Category.Info,
  isGuildOnly: true,
  meta: {
    descr: "Set a language",
    usage: "lang [es | en]",
  },
  async execute({ bot, message, args: { args } }) {
    if (!db) return;

    const input = args[0];

    const member = bot.members.get(BigInt("" + message.authorId + message.guildId!)) ?? (await getMember(bot, message.guildId!, message.authorId));
    const guild = bot.guilds.get(message.guildId!) ?? (await getGuild(bot, message.guildId!));

    if (!hasGuildPermissions(bot, guild, member, ["ADMINISTRATOR"])) {
      return "Not enough permissions!!!";
    }

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
