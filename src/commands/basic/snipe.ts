import type { Command } from 'types/command';
import { MessageEmbed, Permissions, GuildChannel } from 'discord.js';
import { cache } from '../../utils/Util.js';

export default <Command> {
	label: 'snipe',
	alias: [],
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Busca el último mensaje eliminado en el canal'
		}
	},
	execute: () => (msg) => {
		const sniped = cache.snipedMessages.get(msg.channel.id);

		if (!sniped)
			return '¡No hay mensajes!';

		if (!msg.guild) return;

		if (!msg.member?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
			return 'Debido a que el comando es invasivo, necesitas permisos para usarlo';

		if (msg.channel instanceof GuildChannel)
			if (!msg.channel.permissionsFor(msg.member).has(Permissions.FLAGS.MANAGE_MESSAGES))
				return 'Debido a que el comando es invasivo, necesitas permisos para usarlo';

		return new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(sniped.content)
			.setAuthor(sniped.author.tag, sniped.author.displayAvatarURL())
			.setTimestamp(sniped.createdAt)
			.setFooter(sniped.author.id);
	}
};