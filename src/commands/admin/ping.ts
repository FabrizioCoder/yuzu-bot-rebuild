import type { Command } from 'types/command';

export default <Command> {
	label: 'ping',
	alias: [],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Ping',
			short: 'Ping',
			usage: ''
		}
	},
	cooldown: 10,
	execute: session => () => `pong! \\🏓 ${Math.floor(session.ws.ping)}ms`
};