import type { Monitor } from 'types/monitor';
import { Options, cache } from '../../utils/Util.js';
import { Collection as List } from '@discordjs/collection';
import { Constants } from 'discord.js';
import * as Controller from '../../database/controllers/prefix.controller.js';

export default <Monitor<typeof Constants.Events.MESSAGE_CREATE>> {
	name: 'cooldownMonitor',
	ignoreBots: true,
	ignoreDM: true,
	kind: Constants.Events.MESSAGE_CREATE,
	async execute(message) {
		const prefix = !message.guild ? Options.PREFIX : (await Controller.get(message.guild.id))?.prefix ?? Options.PREFIX;
		// arguments, ej: .command args0 args1 args2 ...
		const args = message.content.slice(prefix.length).trim().split(/\s+/gm);
		const name = args.shift()?.toLowerCase();

		if (!name) return;

		const command = cache.commands.get(name) ?? cache.commands.get(cache.aliases.get(name) as string);

		if (!command) return;

		// cooldowns map
		if (!cache.cooldowns.has(command.label))
			cache.cooldowns.set(command.label, new List<string, number>());
	}
};