import { Configuration, loadDynamicCommands, loadLanguages, setupLogger } from "utils";
import { Oasis } from "oasis/client";
import { CommandoCache } from "oasis/commando";
import { loadEverything } from "oasis/fileloader";
import { enableCachePlugin } from "cache_plugin";
import { startDatabase } from "database/db";
import { upsertApplicationCommands } from "discordeno";

await loadEverything("./src/bot", ["commands", "events", "tasks", "monitors"]);

loadDynamicCommands();

await setupLogger();
await loadLanguages();

const client = new Oasis({
  // important
  botId: Deno.args[0] ? BigInt(Deno.args[0]) : Configuration.misc.botId,
  // plugins
  plugins: [enableCachePlugin /*, enablePermissionsPlugin*/],
  // transforms a Map<string, T> into a Record<string, T["execute"]>
  events: Object.fromEntries(Array.from(CommandoCache.events.entries(), ([name, event]) => [name, event.execute])),
});

await client.start(Deno.args[1] ?? Configuration.bot.gateway.token, Configuration.bot.gateway.intents);

// UPLOAD SLASH COMMANDS ON TEST SERVER
if (Configuration.development) {
  await upsertApplicationCommands(
    client.bot,
    CommandoCache.slashCommands.map((cmd) => cmd.data),
    Configuration.logs.guildId || undefined
  );
}

// start the database
await startDatabase();
