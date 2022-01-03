import type { Command } from "../bot/types/command.ts";
import type { Event } from "../bot/types/event.ts";
import type { Monitor } from "../bot/types/monitor.ts";
import type { Task } from "../bot/types/task.ts";
import type { ButtonCollector, MessageCollector } from "../bot/types/collector.ts";
import type { DiscordenoAttachment, DiscordenoMessage, EventHandlers } from "discordeno";
import { Collection } from "discordeno";

// slash commands
export const slashCommands: Collection<string, Command<true>> = new Collection();

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

export const lastMessages = new Collection<bigint, DiscordenoMessage>();
export const lastAttachments = new Collection<bigint, DiscordenoAttachment[]>();
export const alreadySendedInStarboard = new Collection<bigint, DiscordenoMessage>();
