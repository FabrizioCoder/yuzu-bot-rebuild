import type { Command } from 'types/command';
import type { SlashCommand } from 'types/slashCommand';
import type { Event } from 'types/event';
import type { Monitor } from 'types/monitor';
import type { Task } from 'types/task';
import type { ClientEvents } from 'discord.js';

import { Client } from 'discord.js';
import { intents, cache, handle } from './utils/Util.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import './utils/handleAPICommands.js';
import './database/db.js';

const rootDir = dirname(fileURLToPath(import.meta.url));
const session = new Client({ intents });

// event handler
handle<Event<keyof ClientEvents>>(rootDir, 'events', event => {
	if (event.disabled) return;
	session[event.once ? 'once' : 'on'](event.kind, (...args) => event.execute(...args));
	cache.events.set(event.kind, event);
});

// command handler with aliases (useful until april 2022)
handle<Command>(rootDir, 'commands', command => {
	if (command.options?.disabled) return;
	command.alias?.forEach(alias => cache.aliases.set(alias, command.label));
	cache.commands.set(command.label, command);
});

// slash command handler
handle<SlashCommand>(rootDir, 'slashcommands', slashCommand => {
	if (slashCommand.disabled) return;
	cache.slashCommands.set(slashCommand.data.name, slashCommand);
});

// monitor handler
handle<Monitor<keyof ClientEvents>>(rootDir, 'monitors', monitor => {
	if (monitor.disabled) return;
	cache.monitors.set(monitor.name, monitor);
});

// task handler
handle<Task>(rootDir, 'tasks', task => {
	if (task.disabled) return;
	cache.tasks.set(task.name, task);
});

// error handling events
process.on('error', console.error);
process.on('unhandledPromiseRejection', console.error);

// login
await session.login();