import { Configuration, loadDynamicCommands } from "utils";
import { cache, loadFilesFromBot } from "oasis";
import { createBot, startBot } from "discordeno";
import { enableCachePlugin } from "cache_plugin";
import { startDatabase } from "../database/db.ts";

import "dotenv/load";

const folders = ["slash_commands", "commands", "events", "tasks", "monitors"];

for (const index in folders) {
  await loadFilesFromBot(folders[index]);
}

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
