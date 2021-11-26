import type { Command } from "./src/types/command.ts";
import type { Event } from "./src/types/event.ts";
import type { Task } from "./src/types/task.ts";
import type { Monitor } from "./src/types/monitor.ts";
import type { EventHandlers } from "./deps.ts";

import { cache as cachePlugin, createBot, path, startBot } from "./deps.ts";

import { cache, handle, Options } from "./src/utils/mod.ts";

// scripts
import "./src/utils/scripts/APICommands.ts";
import "https://deno.land/x/dotenv/load.ts";

const token = Deno.env.get("TOKEN") ?? " ";
const rootd = path.dirname(import.meta.url) + "/src";

// /slash_commands/
await handle<Command<true>>(rootd, "slash_commands", (command) => {
  if (command.disabled) return;
  cache.slashCommands.set(command.data.name, command);
  console.log("Loaded command %s", command.data.name);
});

// /commands/
await handle<Command<false>>(rootd, "commands", (command) => {
  if (command.disabled) return;
  cache.commands.set(command.data, command);
  console.log("Loaded command %s", command.data);
});

// /events/
await handle<Event<keyof EventHandlers>>(rootd, "events", (event) => {
  if (event.disabled) return;
  cache.events.set(event.name, event);
  console.log("Loaded event %s", event.name);
});

// /tasks/
await handle<Task>(rootd, "tasks", (task) => {
  if (task.disabled) return;
  cache.tasks.set(task.name, task);
  console.log("Loaded task %s", task.name);
});

// /monitors/
await handle<Monitor<keyof EventHandlers>>(rootd, "monitors", (monitor) => {
  if (monitor.disabled) return;
  cache.monitors.set(monitor.name, monitor);
  console.log("Loaded monitor %s", monitor.name);
});

// start the bot
const bot = createBot({
  botId: Options.SESSION_ID,
  intents: ["Guilds", "GuildMessages"],
  events: Object.fromEntries( // transforms a Map<string, T> into an Object
    Array.from(
      cache.events.entries(),
      ([k, v]) => [k, v.execute],
    ),
  ),
  cache: { isAsync: false },
  token,
});

// it was hard to tell if it works on my version
cachePlugin.enableCachePlugin(bot as any);
// cachePlugin.enableCacheSweepers(bot as any);

await startBot(bot);
