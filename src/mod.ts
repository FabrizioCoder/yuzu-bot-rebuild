import { Configuration, loadDynamicCommands, loadLanguages } from "utils";
import { cache, loadEverything, OasisMake } from "oasis";
import { enableCachePlugin } from "cache_plugin";
import { enablePermissionsPlugin } from "permissions_plugin";
import { startDatabase } from "database/db";

import "dotenv/load";

await loadEverything("./src/bot", ["commands", "events", "tasks", "monitors"]);

loadDynamicCommands();

await loadLanguages();

const client = OasisMake({
  // important
  botId: Deno.args[0] ? BigInt(Deno.args[0]) : Configuration.botId,
  // plugins
  plugins: [enableCachePlugin, enablePermissionsPlugin],
  // transforms a Map<string, T> into a Record<string, T["execute"]>
  events: Object.fromEntries(Array.from(cache.events.entries(), ([name, event]) => [name, event.execute])),
});

await client.start(Deno.args[1] ?? Deno.env.get("TOKEN") ?? Configuration.token, [
  "Guilds",
  "GuildMessages",
  "GuildMessageReactions",
  "GuildEmojis",
  "DirectMessages",
]);

// start the database
await startDatabase();
