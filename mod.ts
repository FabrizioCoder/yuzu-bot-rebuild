#!/usr/bin/env -S deno run

import type { Command } from "./src/types/command.ts";
import type { Event } from "./src/types/event.ts";
import type { Task } from "./src/types/task.ts";
import type { Monitor } from "./src/types/monitor.ts";

import { cache, handle, Options } from "./src/utils/mod.ts";
import { CachePlugin, createBot, PermissionsPlugin, startBot } from "./deps.ts";

// scripts
import "https://deno.land/x/dotenv/load.ts";
import "./src/utils/scripts/APICommands.ts";

const token = Deno.env.get("TOKEN") ?? Options.TOKEN;

await Promise.all([
  // /slash_commands/
  handle<Command>("slash_commands", (command) => {
    if ("disable" in command) return;
    cache.slashCommands.set(command.data.name, command);
    console.log("Loaded command %s", command.data.name);
  }),
  // /commands/
  handle<Command<false>>("commands", (command) => {
    if ("disable" in command) return;
    cache.commands.set(command.data.name, command);
    console.log("Loaded command %s", command.data.name);
  }),
  // /events/
  handle<Event>("events", (event) => {
    if ("disable" in event) return;
    cache.events.set(event.name, event);
    console.log("Loaded event %s", event.name);
  }),
  // /tasks/
  handle<Task>("tasks", (task) => {
    if ("disable" in task) return;
    cache.tasks.set(task.name, task);
    console.log("Loaded task %s", task.name);
  }),
  // /monitors/
  handle<Monitor>("monitors", (monitor) => {
    if ("disable" in monitor) return;
    cache.monitors.set(monitor.name, monitor);
    console.log("Loaded monitor %s", monitor.name);
  }),
  // /context_menus/
  // handle<unknown>("context_menus", () => {
  //   return;
  // }),
]);

// start the bot
const bot = createBot({
  botId: Options.ID,
  intents: ["Guilds", "GuildMessages", "GuildEmojis", "DirectMessages"],
  events: Object.fromEntries( // transforms a Map<string, T> into an Object
    Array.from(
      cache.events.entries(),
      ([k, v]) => [k, v.execute],
    ),
  ),
  token,
});

await startBot(
  PermissionsPlugin.enablePermissionsPlugin(
    CachePlugin.enableCachePlugin(
      bot,
    ),
  ),
);

// more scripts
await import("./src/database/db.ts");
