import type { Command } from "./helpers/cache/createCommand.ts";
import type { Event } from "./helpers/cache/createEvent.ts";
import type { Monitor } from "./helpers/cache/createMonitor.ts";
import type { Task } from "./helpers/cache/createTask.ts";
import type { ButtonCollector, MessageCollector } from "./types/collector.ts";

import { Collection } from "discordeno";

// slash commands
export const slashCommands: Collection<string, Command> = new Collection();

// regular commands
export const commands: Collection<string, Command<false>> = new Collection();
export const aliases: Collection<string, string> = new Collection();

// events
export const events: Collection<string, Event> = new Collection();

// monitors
export const monitors: Collection<string, Monitor> = new Collection();

// tasks
export const tasks: Collection<string, Task> = new Collection();

// running tasks
export const runningTasks = {
  initialTimeouts: new Set<number>(),
  intervals: new Set<number>(),
};

export const collectors = {
  buttons: new Collection<bigint, ButtonCollector>(),
  messages: new Collection<bigint, MessageCollector>(),
};
