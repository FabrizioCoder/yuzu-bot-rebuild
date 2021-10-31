import type { Client, Message, MessageEmbed, MessageOptions } from 'discord.js';

export type CommandMessageContent =
	| MessageEmbed
	| MessageOptions
	| string
	| undefined;

export type CommandOptions = {
	guildOnly?: boolean, // if the command can be executed on dm
	adminOnly?: boolean,
	// if is disabled
	disabled?: boolean,
	information?: {
		descr?: string, // description
		usage?: string, // duh
		short?: string  // short description
	}
};

// this will be deleted on april 2022
export type Command = {
	readonly options?: CommandOptions,
	readonly label: string, // the name of the command
	readonly alias?: readonly string[], // aliases like ['avatar', 'pfp', 'icon']
	readonly cooldown?: (number | 3),
	readonly execute: (session: Client) => (msg: Message, args: readonly string[]) => CommandMessageContent | Promise<CommandMessageContent>
};