import { Configuration, loadDynamicCommands, loadLanguages } from "utils";
import { cache, load, Oasis } from "oasis";
import { enableCachePlugin } from "cache_plugin";
import { enablePermissionsPlugin } from "permissions_plugin";
import { startDatabase } from "database/db";

import "dotenv/load";

const folders = ["commands", "events", "tasks", "monitors"] as const;

for (const folder of folders) {
  await load("./src/bot", folder);
}

loadDynamicCommands();

await loadLanguages();

const client = new Oasis({
  // important
  botId: Deno.args[0] ? BigInt(Deno.args[0]) : Configuration.ID,
  // plugins
  plugins: [enableCachePlugin, enablePermissionsPlugin],
  // transforms a Map<string, T> into a Record<string, T["execute"]>
  events: Object.fromEntries(Array.from(cache.events.entries(), ([name, event]) => [name, event.execute])),
});

await client.start(Deno.args[1] ?? Deno.env.get("TOKEN") ?? Configuration.TOKEN, [
  "Guilds",
  "GuildMessages",
  "GuildMessageReactions",
  "GuildEmojis",
  "DirectMessages",
]);

// start the database
await startDatabase();
