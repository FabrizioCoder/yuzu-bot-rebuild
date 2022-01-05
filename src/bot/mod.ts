import type { Command } from "./types/command.ts";
import type { Event } from "./types/event.ts";
import type { Task } from "./types/task.ts";
import type { Monitor } from "./types/monitor.ts";
import { loadFilesFromBot } from "oasis";
import { cache, Configuration, logger } from "utils";
import { createBot, startBot } from "discordeno";
import { enableCachePlugin } from "cache_plugin";
import { cyan } from "fmt/colors";

import "dotenv/load";

const time = Date.now();
const log = logger.create({ name: "Handler" });

await Promise.all([
  // /slash_commands/
  loadFilesFromBot<Command>("slash_commands", (slashCommand) => {
    slashCommand.data.options?.map((o) => {
      if ("options" in o) console.log("options: for %s", o.name, o.options);
    });
    cache.slashCommands.set(slashCommand.data.name, slashCommand);
    log.info(`Loaded ${cyan("slash command")} ${slashCommand.data.name}`);
  }),
  // /commands/
  loadFilesFromBot<Command<false>>("commands", (command) => {
    cache.commands.set(command.data.name, command);
    log.info(`Loaded ${cyan("command")} ${command.data.name}`);
  }),
  // /events/
  loadFilesFromBot<Event>("events", (event) => {
    cache.events.set(event.name, event);
    log.info(`Loaded ${cyan("event")} ${event.name}`);
  }),
  // /tasks/
  loadFilesFromBot<Task>("tasks", (task) => {
    cache.tasks.set(task.name, task);
    log.info(`Loaded ${cyan("task")} ${task.name}`);
  }),
  // /monitors/
  loadFilesFromBot<Monitor>("monitors", (monitor) => {
    cache.monitors.set(monitor.name, monitor);
    log.info(`Loaded ${cyan("monitor")} ${monitor.name}`);
  }),
]);

logger.info(`Loaded in ${Date.now() - time} ms`);

// dynamic commands
await import("../utils/scripts/APICommands.ts");

const bot = createBot({
  botId: Deno.args[0] ? BigInt(Deno.args[0]) : Configuration.ID,
  intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "GuildEmojis", "DirectMessages"],
  events: Object.fromEntries(
    // transforms a Map<string, T> into a Record<string, T["execute"]>
    Array.from(cache.events.entries(), ([name, event]) => [name, event.execute])
  ),
  token: Deno.env.get("TOKEN") ?? Configuration.TOKEN,
});

// start the bot
await startBot(enableCachePlugin(bot));

// start the database
await import("../database/db.ts");
