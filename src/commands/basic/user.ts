import type { Command } from 'types/command';
import { MessageEmbed } from 'discord.js';

export default <Command> {
	label: 'user',
	alias: [],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca un usuario.',
			short: 'Busca un usuario.',
			usage: '[@Mención]'
		}
	},
	disabled: true,
	execute: session => (msg, args) => {
		const search = args.join(' ');
		const target = msg.mentions.users.first();

		if (!search && !target)
			return 'Menciona un usuario';

		// disabled because sharding
		const user = session.users.cache.get(search) ?? target;

		if (!user)
			return 'No se encontró el usuario';

		return new MessageEmbed()
			.setColor('RANDOM')
			.setTitle(user.username)
			.addField('Bot?', user.bot ? 'Sí' : 'No');
	}
};