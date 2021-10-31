import type { Command } from 'types/command';
import { MessageEmbed } from 'discord.js';
import { Options, cache } from '../../utils/Util.js';

export default <Command> {
	label: 'help',
	alias: ['h'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca información acerca de un comando - muestra todos los comandos.',
			short: 'Busca comandos.',
			usage: '[Comando]'
		}
	},
	cooldown: 5,
	execute: session => (msg, args) => {

		const search = args.join(' ');
		const base = new MessageEmbed()
			.setColor('RANDOM')
			.setThumbnail(msg.author.displayAvatarURL())
			.setTimestamp()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL())
			.setDescription(`El prefix del bot es ${Options.PREFIX}`);

		if (!search) {

			const info = [ ...cache.commands.values() ]
				.map(c => [
					`- \`${`[${c.label}] ${c?.alias ? c.alias.join(', ') : ''}`.trim() ?? c.label}\``,
					` ${c?.options?.information?.short ?? c.options?.information?.descr ?? 'Comando sin descripción'}`
				]);

			const commandEmbed = Object.assign(<MessageEmbed> Object.create(base), base)
				.setTitle(String.raw`\👾 Comandos de ${session.user?.tag}`)
				.setColor('RANDOM')
				.setDescription([ base.description ?? 'sin descripción...', ...info ].join('\n'));

			return commandEmbed;
		}

		const cmd = <Command> cache.commands.get(search);

		if (!cmd)
			return 'No encontré ese comando';

		return Object.assign(<MessageEmbed> Object.create(base), base)
			.setTitle('Información del comando.')
			.addFields([
				{
					name: 'Nombre del comando',
					value: cmd.label ?? '???'
				},
				{
					name: 'Alias',
					value: !cmd.alias ? 'sin alias' : cmd.alias.length > 0 ? cmd.alias.join(' ') : 'sin alias'
				},
				{
					name: 'Información y uso del comando',
					value: [
						cmd.options?.information?.descr ?? cmd.options?.information?.short ?? 'Comando sin descripción',
						cmd.options?.information?.usage ?? 'Comando sin información.'
					].join('\n')
				},
				{
					name: 'Cooldown',
					value: `${cmd.cooldown ?? 3}`
				}
			]);
	}
};