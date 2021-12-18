import type { Command } from "./src/types/command.ts";
import type { Event } from "./src/types/event.ts";
import type { Task } from "./src/types/task.ts";
import type { Monitor } from "./src/types/monitor.ts";
import type { EventHandlers } from "./deps.ts";

import { cache, loadFilesFromFolder, Options } from "./src/utils/mod.ts";
import { createBot, enableCachePlugin as addCache, startBot } from "./deps.ts";

import "https://deno.land/x/dotenv/load.ts";

await Promise.all([
  // /slash_commands/
  loadFilesFromFolder<Command>("slash_commands", (slashCommand) => {
    if ("disable" in slashCommand) return;
    cache.slashCommands.set(slashCommand.data.name, slashCommand);
    console.log("Loaded slash command %s", slashCommand.data.name);
  }),
  // /commands/
  loadFilesFromFolder<Command<false>>("commands", (command) => {
    if ("disable" in command) return;
    cache.commands.set(command.data.name, command);
    console.log("Loaded command %s", command.data.name);
  }),
  // /events/
  loadFilesFromFolder<Event<keyof EventHandlers>>("events", (event) => {
    if ("disable" in event) return;
    cache.events.set(event.name, event);
    console.log("Loaded event %s", event.name);
  }),
  // /tasks/
  loadFilesFromFolder<Task>("tasks", (task) => {
    if ("disable" in task) return;
    cache.tasks.set(task.name, task);
    console.log("Loaded task %s", task.name);
  }),
  // /monitors/
  loadFilesFromFolder<Monitor<keyof EventHandlers>>("monitors", (monitor) => {
    if ("disable" in monitor) return;
    cache.monitors.set(monitor.name, monitor);
    console.log("Loaded monitor %s", monitor.name);
  }),
]);

// dynamic commands
await import("./src/utils/scripts/APICommands.ts");

const bot = createBot({
  botId: Deno.args[0] ? BigInt(Deno.args[0]) : Options.ID,
  intents: ["Guilds", "GuildMessages", "GuildEmojis", "DirectMessages"],
  events: Object.fromEntries(
    // transforms a Map<string, T> into a Record<string, T>
    Array.from(cache.events.entries(), ([name, event]) => [name, event.execute])
  ),
  token: Deno.args[1] ?? Deno.env.get("TOKEN") ?? Options.TOKEN,
});

// start the bot
await startBot(addCache(bot));

// start the database
await import("./src/database/db.ts");
