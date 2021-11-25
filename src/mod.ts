import type { Command } from "./types/command.ts";
import type { Event } from "./types/event.ts";
import type { Task } from "./types/task.ts";
import type { Monitor } from "./types/monitor.ts";
import type { EventHandlers } from "./deps.ts";

import { createBot, path, startBot } from "./deps.ts";
import { cache, handle, Options } from "./utils/mod.ts";

// scripts
import "./utils/Scripts/APICommands.ts";

const token = Options.TOKEN;
const rootd = path.dirname(import.meta.url);

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
  token,
  intents: ["Guilds", "GuildMessages"],
  botId: Options.SESSION_ID,
  events: Object.fromEntries( // transforms a Map<string, any> into an Object
    Array.from(
      cache.events.entries(),
      ([k, v]) => [k, v.execute],
    ),
  ),
  cache: { isAsync: false },
});

await startBot(bot);
