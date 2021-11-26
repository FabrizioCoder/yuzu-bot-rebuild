import type { Command } from "../../types/command.ts";
import type { Event } from "../../types/event.ts";
import type { Monitor } from "../../types/monitor.ts";
import type { Task } from "../../types/task.ts";
import type {
  ButtonCollector,
  MessageCollector,
} from "../../types/collector.ts";
import type { EventHandlers } from "../../../deps.ts";

import { Collection as List } from "../../../deps.ts";

// slash commands
const slashCommands: List<string, Command<true>> = new List();

// regular commands
const commands: List<string, Command<false>> = new List();

// events
const events: List<string, Event<keyof EventHandlers>> = new List();

// monitors
const monitors: List<string, Monitor<keyof EventHandlers>> = new List();

// tasks
const tasks: List<string, Task> = new List();

// running tasks
const runningTasks = {
  initialTimeouts: new Set<number>(),
  intervals: new Set<number>(),
};

const collectors = {
  buttons: new List<bigint, ButtonCollector>(),
  messages: new List<bigint, MessageCollector>(),
};

export const cache = {
  slashCommands,
  commands,
  events,
  monitors,
  tasks,
  runningTasks,
  collectors,
};
