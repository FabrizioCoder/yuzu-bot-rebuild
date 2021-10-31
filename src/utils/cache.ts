import type { Command } from 'types/command';
import type { Monitor } from 'types/monitor';
import type { Event } from 'types/event';
import type { SlashCommand } from 'types/slashCommand';
import type { Task } from 'types/task';
import type { Snowflake, Message, ClientEvents } from 'discord.js';
import { Collection as List } from '@discordjs/collection';

// cooldowns for old command handler
export var cooldowns: List<string, List<string, number>> = new List;

// command handler
export var commands: List<string, Command> = new List;
export var aliases: List<string, string> = new List;

// event handler
export var events: List<string, Event<keyof ClientEvents>> = new List;

// new command handler
export var monitors: List<string, Monitor<keyof ClientEvents>> = new List;
export var slashCommands: List<string, SlashCommand> = new List;

// tasks
export var tasks: List<string, Task> = new List;
export var runningTasks = { initialTimeouts: new Set<NodeJS.Timeout>(), intervals: new Set<NodeJS.Timer>() };

// snipe command 			  //channel  //message
export var snipedMessages: List<Snowflake, Message> = new List;