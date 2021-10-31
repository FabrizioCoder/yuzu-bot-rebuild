import type { Command } from 'types/command';
import { MessageEmbed } from 'discord.js';

export default <Command> {
	label: 'avatar',
	alias: ['pfp', 'pic'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca el avatar de un usuario.',
			short: 'Busca avatares.',
			usage: '[@Mención]'
		}
	},
	execute: () => (msg) => {
		const target = msg.mentions.users.first() ?? msg.author;
		const avatar = target.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' || 'gif' });

		return new MessageEmbed()
			.setAuthor(target.tag, avatar)
			.setColor(msg.member ? msg.member.displayColor : 'RANDOM')
			.setTitle(`Avatar pedido por ${msg.author.tag}`)
			.setDescription([
				`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})`,
				`[Avatar URL](${avatar})`
			].join('\n'))
			.setImage(avatar);
	}
};