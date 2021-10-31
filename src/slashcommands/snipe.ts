import type { SlashCommand } from 'types/slashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, Permissions, GuildChannel, GuildMember } from 'discord.js';
import { Division, cache } from '../utils/Util.js';

export default <SlashCommand> {
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Busca el último mensaje eliminado en el canal',
			short: 'Mensajes eliminados'
		}
	},
	division: Division.FUN,
	data: new SlashCommandBuilder()
		.setName('snipe')
		.setDescription('Busca el último mensaje eliminado en el canal'),

	execute(interaction) {
		if (!interaction.channel)
			return;

		const sniped = cache.snipedMessages.get(interaction.channel.id);

		if (!sniped)
			return '¡No hay mensajes!';

		// Permissions
		if (interaction.member instanceof GuildMember) {
			if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
				return 'Debido a que el comando es invasivo, necesitas permisos para usarlo';

			if (interaction.channel instanceof GuildChannel)
				if (!interaction.channel.permissionsFor(interaction.member).has(Permissions.FLAGS.MANAGE_MESSAGES))
					return 'Debido a que el comando es invasivo, necesitas permisos para usarlo';
		}

		return new MessageEmbed()
			.setColor('RANDOM')
			.setDescription(sniped.content)
			.setAuthor(sniped.author.tag, sniped.author.displayAvatarURL())
			.setTimestamp(sniped.createdAt)
			.setFooter(sniped.author.id);
	}
};