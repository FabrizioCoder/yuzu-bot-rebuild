import type { Command } from "./types/command.ts";
import type { Event } from "./types/event.ts";
import type { Task } from "./types/task.ts";
import type { Monitor } from "./types/monitor.ts";
import type { EventHandlers } from "discordeno";

import { cache, Configuration, loadFilesFromFolder, logger } from "../utils/mod.ts";
import { createBot, startBot } from "discordeno";
import { enableCachePlugin } from "cache_plugin";

import "https://deno.land/x/dotenv/load.ts";

const log = logger.create({ name: "Handler" });

await Promise.all([
  // /slash_commands/
  loadFilesFromFolder<Command>("slash_commands", (slashCommand) => {
    if ("disable" in slashCommand) return;
    cache.slashCommands.set(slashCommand.data.name, slashCommand);
    log.info(`Loaded ${log.color("slash command")} ${slashCommand.data.name}`);
  }),
  // /commands/
  loadFilesFromFolder<Command<false>>("commands", (command) => {
    if ("disable" in command) return;
    cache.commands.set(command.data.name, command);
    log.info(`Loaded ${log.color("command")} ${command.data.name}`);
  }),
  // /events/
  loadFilesFromFolder<Event<keyof EventHandlers>>("events", (event) => {
    if ("disable" in event) return;
    cache.events.set(event.name, event);
    log.info(`Loaded ${log.color("event")} ${event.name}`);
  }),
  // /tasks/
  loadFilesFromFolder<Task>("tasks", (task) => {
    if ("disable" in task) return;
    cache.tasks.set(task.name, task);
    log.info(`Loaded ${log.color("task")} ${task.name}`);
  }),
  // /monitors/
  loadFilesFromFolder<Monitor<keyof EventHandlers>>("monitors", (monitor) => {
    if ("disable" in monitor) return;
    cache.monitors.set(monitor.name, monitor);
    log.info(`Loaded ${log.color("monitor")} ${monitor.name}`);
  }),
]);

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
