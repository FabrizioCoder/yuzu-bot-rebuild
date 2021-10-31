import type { Command } from 'types/command';
import { MessageEmbed, Util } from 'discord.js';

export default <Command> {
	label: 'serverinfo',
	alias: ['sv', 'server'],
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Busca información acerca del servidor.',
			short: 'Ver el servidor.',
			usage: '...'
		}
	},
	execute: () => (msg) => {
		const channels: { readonly [ k: string ]: number | undefined } = {
			'text': msg.guild?.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size ?? 0,
			'voice': msg.guild?.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size ?? 0
		};
		const bots = msg.guild?.members.cache.filter(member => member.user.bot).size ?? 0;
		const members = msg.guild?.members.cache.filter(member => !member.user.bot).size ?? 0;

		const roles = msg.guild?.roles.cache
			.filter(x => !x.managed)
			.filter(x => x.name  !== '@everyone')
			.map(x => x.toString())
			.slice(0, 15)
			.join(' ');

		return new MessageEmbed()
			.setAuthor(msg.guild?.name ?? 'No reconocido', msg.guild?.iconURL() ?? msg.author.displayAvatarURL())
			.setColor('RANDOM')
			.setThumbnail(msg.guild?.iconURL() ?? msg.author.displayAvatarURL())
			.setTimestamp()
			.setFooter(`ID: ${msg.guild?.id}`)
			.addFields([
				{
					name: 'Roles',
					value: `${Util.splitMessage(roles ?? '@everyone', { maxLength: 1024 })[0]} ...`,
					inline: false
				},
				{
					name: 'Creada',
					value: <string> msg.guild?.createdAt.toLocaleString('es'),
					inline: false
				},
				{
					name: 'Bots',
					value: bots.toString(),
					inline: true
				},
				{
					name: 'Members',
					value: members.toString(),
					inline: true
				},
				{
					name: 'Channels',
					value: `**Text**: ${channels.text}\n**Voice**: ${channels.voice}`,
					inline: true
				}
			]);
	}
};