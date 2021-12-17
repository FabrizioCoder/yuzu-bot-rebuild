import type { Command } from "./src/types/command.ts";
import type { Event } from "./src/types/event.ts";
import type { Task } from "./src/types/task.ts";
import type { Monitor } from "./src/types/monitor.ts";
import type { EventHandlers, SnakeCasedPropertiesDeep } from "./deps.ts";

import { cache, handle, Options } from "./src/utils/mod.ts";
import { createBot, enableCachePlugin, startBot } from "./deps.ts";

import "https://deno.land/x/dotenv/load.ts";

await Promise.all([
  // /slash_commands/
  handle<Command>("slash_commands", (slashCommand) => {
    if ("disable" in slashCommand) return;
    cache.slashCommands.set(slashCommand.data.name, slashCommand);
    console.log("Loaded slash command %s", slashCommand.data.name);
  }),
  // /commands/
  handle<Command<false>>("commands", (command) => {
    if ("disable" in command) return;
    cache.commands.set(command.data.name, command);
    console.log("Loaded command %s", command.data.name);
  }),
  // /events/
  handle<Event<keyof EventHandlers>>("events", (event) => {
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
  handle<Monitor<keyof EventHandlers>>("monitors", (monitor) => {
    if ("disable" in monitor) return;
    cache.monitors.set(monitor.name, monitor);
    console.log("Loaded monitor %s", monitor.name);
  }),
]);

await import("./src/utils/scripts/APICommands.ts");

const bot = createBot({
  botId: Options.ID,
  intents: ["Guilds", "GuildMessages", "GuildEmojis", "DirectMessages"],
  events: Object.fromEntries( // transforms a Map<string, T> into a Record<string, T>
    Array.from(
      cache.events.entries(),
      ([name, event]) => [name, event.execute],
    ),
  ),
  token: Deno.env.get("TOKEN") ?? Options.TOKEN,
});

// start the bot
await startBot(
  enableCachePlugin(
    bot,
  ),
);

// more scripts
await import("./src/database/db.ts");
