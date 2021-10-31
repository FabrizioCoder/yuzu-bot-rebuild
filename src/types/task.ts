import type { Milliseconds } from '../utils/Util.js';
import type { Client } from 'discord.js';

export type Task = {
	name: string,
	interval: Milliseconds,
	disabled?: boolean,
	execute: (session: Client) => void | Promise<void>
};