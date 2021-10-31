import type { ClientEvents } from 'discord.js';

export type Event<T extends keyof ClientEvents> = {
	kind: T,
	once?: boolean,
	disabled?: boolean,
	execute: (...args: ClientEvents[T]) => void | Promise<void>
}