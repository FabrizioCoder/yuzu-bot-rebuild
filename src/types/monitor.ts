import type { ClientEvents } from 'discord.js';

export type Monitor<T extends keyof ClientEvents> = {
	name: string,
	ignoreBots: boolean,
	ignoreDM: boolean,
	disabled?: boolean,
	kind?: T,
	execute: (...args: ClientEvents[T]) => void | Promise<void>
}

// T<'messageCreate'>