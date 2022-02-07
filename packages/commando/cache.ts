import type { Command } from "./cache/createCommand.ts";
import type { Event } from "./cache/createEvent.ts";
import type { Monitor } from "./cache/createMonitor.ts";
import type { Task } from "./cache/createTask.ts";

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
