import type { BotWithCache } from "cache_plugin";

import i18next from "https://deno.land/x/i18next@v20.2.2/index.js";
import Backend from "https://deno.land/x/i18next_fs_backend@v1.1.1/index.js";

import { getCollection, getLanguage } from "database/controllers/language_controller.ts";
import { db } from "database/db";

import { getGuild } from "discordeno";

// important for the database to work
export type Languages = "es_MX" | "en_US";

export async function translate(bot: BotWithCache, key: string, guildId?: bigint, options?: unknown): Promise<string> {
  const guild = guildId ? bot.guilds.get(guildId) ?? (await getGuild(bot, guildId)) : undefined;
  const language =
    guildId && db
      ? (await getLanguage(getCollection(db), guildId).then((a) => a?.locale)) ?? guild?.preferredLocale ?? "en_US"
      : guild?.preferredLocale ?? "en_US";

  // undefined is silly bug cause i18next dont have proper typings
  const languageMap = i18next.getFixedT(language, undefined) || i18next.getFixedT("en_US", undefined);

  return languageMap(key, options);
}

export async function determineNamespaces(path: string, namespaces: string[] = [], folderName = "") {
  for await (const file of Deno.readDir(Deno.realPathSync(path))) {
    if (file.isDirectory) {
      const isLanguage = file.name.includes("-") || file.name.includes("_");

      namespaces = await determineNamespaces(
        `${path}/${file.name}`,
        namespaces,
        isLanguage ? "" : `${folderName + file.name}/`
      );
    } else {
      const toPush = `${folderName}${file.name.substring(0, file.name.length - 5)}`;
      if (!toPush.startsWith("TODO")) namespaces.push(toPush);
    }
  }

  return [...new Set(namespaces)];
}

export async function loadLanguages() {
  const namespaces = await determineNamespaces(Deno.realPathSync("./src/languages"));
  const languageFolder = [...Deno.readDirSync(Deno.realPathSync("./src/languages"))];

  i18next.use(Backend).init({
    fallbackLng: "en_US",
    preload: languageFolder.map((file) => (file.isDirectory ? file.name : undefined)).filter(Boolean),
    backend: {
      loadPath: `${Deno.realPathSync("./src/languages")}/{{lng}}/{{ns}}.json`,
    },
    initImmediate: false,
    interpolation: { escapeValue: false },
    load: "all",
    lng: "en_US",
    saveMissing: true,
    ns: namespaces,
  });
}
