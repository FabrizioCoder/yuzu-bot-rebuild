import type { Command } from "../types/command.ts";
import type { Event } from "../types/event.ts";
import type { Monitor } from "../types/monitor.ts";
import type { Task } from "../types/task.ts";
import type { ButtonCollector, MessageCollector } from "../types/collector.ts";
import type { DiscordenoAttachment, DiscordenoMessage, EventHandlers } from "../../deps.ts";
import { Collection } from "../../deps.ts";

// slash commands
export const slashCommands: Collection<string, Command<true>> = new Collection();

// regular commands
export const commands: Collection<string, Command<false>> = new Collection();

// events
export const events: Collection<string, Event<keyof EventHandlers>> = new Collection();

// monitors
export const monitors: Collection<string, Monitor<keyof EventHandlers>> = new Collection();

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

export const lastMessages = new Collection<bigint, DiscordenoMessage>();
export const lastAttachments = new Collection<bigint, DiscordenoAttachment[]>();
export const alreadySendedInStarboard = new Collection<bigint, DiscordenoMessage>();
