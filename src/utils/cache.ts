import type { Command } from "../types/command.ts";
import type { Event } from "../types/event.ts";
import type { Monitor } from "../types/monitor.ts";
import type { Task } from "../types/task.ts";
import type { ButtonCollector, MessageCollector } from "../types/collector.ts";
import type {
  DiscordenoAttachment,
  DiscordenoMessage,
  EventHandlers,
} from "../../deps.ts";
import { Collection as List } from "../../deps.ts";

// slash commands
export const slashCommands: List<string, Command<true>> = new List();

// regular commands
export const commands: List<string, Command<false>> = new List();

// events
export const events: List<string, Event<keyof EventHandlers>> = new List();

// monitors
export const monitors: List<string, Monitor<keyof EventHandlers>> = new List();

// tasks
export const tasks: List<string, Task> = new List();

// running tasks
export const runningTasks = {
  initialTimeouts: new Set<number>(),
  intervals: new Set<number>(),
};

export const collectors = {
  buttons: new List<bigint, ButtonCollector>(),
  messages: new List<bigint, MessageCollector>(),
};

export const lastMessages = new List<bigint, DiscordenoMessage>();
export const lastAttachments = new List<bigint, DiscordenoAttachment[]>();
