#!/usr/bin/env -S deno run

import type { Command } from "./src/types/command.ts";
import type { Event } from "./src/types/event.ts";
import type { Task } from "./src/types/task.ts";
import type { Monitor } from "./src/types/monitor.ts";

import { cache, handle, Options } from "./src/utils/mod.ts";
import { dirname } from "https://deno.land/std@0.113.0/path/mod.ts";
import {
  createBot,
  enableCachePlugin,
  enablePermissionsPlugin,
  startBot,
} from "./deps.ts";

// scripts
import "https://deno.land/x/dotenv/load.ts";

const token = Deno.env.get("TOKEN") ?? Options.TOKEN;
const rootd = dirname(import.meta.url) + "/src";

await Promise.all([
  // /slash_commands/
  handle<Command>(rootd, "slash_commands", (command) => {
    if (command.disabled) return;
    cache.slashCommands.set(command.data.name, command);
    console.log("Loaded command %s", command.data.name);
  }),
  // /commands/
  handle<Command<false>>(rootd, "commands", (command) => {
    if (command.disabled) return;
    cache.commands.set(command.data.name, command);
    console.log("Loaded command %s", command.data.name);
  }),
  // /events/
  handle<Event>(rootd, "events", (event) => {
    if (event.disabled) return;
    cache.events.set(event.name, event);
    console.log("Loaded event %s", event.name);
  }),
  // /tasks/
  handle<Task>(rootd, "tasks", (task) => {
    if (task.disabled) return;
    cache.tasks.set(task.name, task);
    console.log("Loaded task %s", task.name);
  }),
  // /monitors/
  handle<Monitor>(rootd, "monitors", (monitor) => {
    if (monitor.disabled) return;
    cache.monitors.set(monitor.name, monitor);
    console.log("Loaded monitor %s", monitor.name);
  }),
]);

// more scripts
await import("./src/utils/scripts/APICommands.ts");
await import("./src/database/db.ts");

// start the bot
const bot = createBot({
  botId: Options.ID,
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

// working by now
enableCachePlugin(bot);

// deno-lint-ignore no-explicit-any
enablePermissionsPlugin(bot as any);

await startBot(bot);
