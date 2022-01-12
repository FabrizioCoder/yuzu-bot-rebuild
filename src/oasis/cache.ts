import type { Command } from "./types/command.ts";
import type { Event } from "./types/event.ts";
import type { Monitor } from "./types/monitor.ts";
import type { Task } from "./types/task.ts";
import type { ButtonCollector, MessageCollector } from "./types/collector.ts";

import { Collection } from "discordeno";

// slash commands
export const slashCommands: Collection<string, Command> = new Collection();

// regular commands
export const commands: Collection<string, Command<false>> = new Collection();

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
