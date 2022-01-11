import { Configuration, loadDynamicCommands, logger } from "utils";
import { cache, loadFilesFromBot } from "oasis";
import { createBot, startBot } from "discordeno";
import { enableCachePlugin } from "cache_plugin";
import { startDatabase } from "../database/db.ts";
import { cyan } from "fmt/colors";

import "dotenv/load";

const time = Date.now();

await Promise.all([
  loadFilesFromBot("slash_commands"),
  loadFilesFromBot("commands"),
  loadFilesFromBot("events"),
  loadFilesFromBot("tasks"),
  loadFilesFromBot("monitors"),
]);

logger.info(`Loaded ${cyan(cache.slashCommands.size.toString())} in ${Date.now() - time} ms`);

// dynamic commands
loadDynamicCommands();

// start the bot
await startBot(
  enableCachePlugin(
    createBot({
      botId: Deno.args[0] ? BigInt(Deno.args[0]) : Configuration.ID,
      intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "GuildEmojis", "DirectMessages"],
      events: Object.fromEntries(
        // transforms a Map<string, T> into a Record<string, T["execute"]>
        Array.from(cache.events.entries(), ([name, event]) => [name, event.execute])
      ),
      token: Deno.env.get("TOKEN") ?? Configuration.TOKEN,
    })
  )
);

// start the database
await startDatabase();
