import type { Command } from 'types/command';
import { Permissions, Util } from 'discord.js';

export default <Command> {
	label: 'say',
	alias: ['esay', 'shadowsay'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Hace que el bot diga algo muy malo',
			short: 'Escribir el siguiente mensaje del bot.',
			usage: '<Texto>'
		}
	},
	execute: () => async (msg, args) => {
		const text = args.join(' ');

		if (!text)
			return 'Escribí el contenido del mensaje o te revoleo a piñas';

		if (text.split(' ').some(word => word === '@everyone' || word === '@here'))
			return 'noup';

		if (msg.mentions.roles.size > 0)
			return 'noup';

		if (msg.mentions.users.size > 0)
			return 'noup';

		if (msg.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
			await msg.delete();

		return { content: Util.removeMentions(text) };
	}
};