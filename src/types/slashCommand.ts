import type { CommandInteraction, MessageEmbed, MessageOptions } from 'discord.js';
import type { SlashCommandBuilder } from '@discordjs/builders';
import type { CommandOptions } from './command';
import type { Division } from '../utils/Constants.js';

export type CommandMessageContent =
	| MessageEmbed
	| MessageOptions
	| string
	| undefined;

// slash commands
export type SlashCommand = {
	readonly disabled?: boolean,
	readonly division: Division,
	readonly options?: Omit<CommandOptions, 'disabled'>,
	readonly data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
	readonly ephemeral?: boolean,
	readonly execute: (i: CommandInteraction) => CommandMessageContent | Promise<CommandMessageContent>
};