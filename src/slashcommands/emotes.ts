import type { SlashCommand } from 'types/slashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, Permissions, DiscordAPIError, Constants } from 'discord.js';
import { Division } from '../utils/Util.js';

const data = new SlashCommandBuilder()
	.setName('emotes')
	.setDescription('Muestra emotes del server, añade y remueve emotes')
	.addSubcommand(command =>
		command
			.setName('add')
			.setDescription('Añade un emoji')
			.addStringOption(option => option.setName('name').setDescription('El nombre del emoji').setRequired(true))
			.addStringOption(option => option.setName('url').setDescription('El link del emoji').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('remove')
			.setDescription('Remueve un emoji')
			.addStringOption(option => option.setName('name').setDescription('El nombre del emoji').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('hide')
			.setDescription('Limita un emoji a un rol')
			.addStringOption(option => option.setName('name').setDescription('El nombre del emoji').setRequired(true))
			.addRoleOption(option => option.setName('limited').setDescription('El rol que podrá usar el emoji').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('display')
			.setDescription('Muestra todos los emojis del servidor')
	);

export default <SlashCommand> {
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Muestra emotes del server, añade y remueve emotes',
			short: 'Muestra emotes',
			usage: '[add | remove | hide | display?]'
		}
	},
	division: Division.UTIL,
	data,

	async execute(interaction): Promise<string | MessageEmbed | void> {
		const arg = interaction.options.getSubcommand();

		if (arg !== 'display') {
			if (typeof interaction.member?.permissions !== 'string')
				if (!interaction.member?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS))
					return 'No tienes permisos suficientes para hacer eso';

			if (!interaction.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS))
				return 'No tengo permisos suficientes para hacer eso';
		}

		if (arg === 'add')
			try {
				const name = interaction.options.getString('name', true);
				const url = interaction.options.getString('url', true);

				const emoji = await interaction.guild?.emojis.create(url, name);

				if (!emoji) return 'No se encontró el emoji creado';
				return `Creé ${emoji?.name} para el server ${emoji?.guild.name} ${emoji?.toString()}`;
			}
			catch (error: unknown) {
				if (error instanceof DiscordAPIError)
					switch (error.code) {
					case Constants.APIErrors.FILE_UPLOADED_EXCEEDS_MAXIMUM_SIZE:
						return 'Error: El emoji es demasiado grande';
						break;
					case Constants.APIErrors.MAXIMUM_EMOJIS:
						return 'Error: Demasiados emojis, prueba borrar uno';
						break;
					default:
						return 'Error: Ha sido imposible crear el emoji';
						break;
					}
			}
		else if (arg === 'remove')
			try {
				const name = interaction.options.getString('name');
				const emoji = interaction.guild?.emojis.cache.find(e => e.name === name);
				const deleted = await emoji?.delete();

				if (!deleted) return 'No se encontró el emoji';
				return `Removí ${deleted?.name} para el server ${emoji?.guild.name}`;
			}
			catch (error: unknown) {
				if (error instanceof DiscordAPIError)
					switch (error.code) {
					default:
						return 'Error: Ha sido imposible remover el emoji';
						break;
					}
			}
		else if (arg === 'hide')
			try {
				const name = interaction.options.getString('name', true);
				const limited = interaction.options.getRole('limited', true);

				const emoji = interaction.guild?.emojis.cache.find(e => e.name === name);
				const role = interaction.guild?.roles.cache.get(limited.id);

				if (!emoji)
					return 'No se encontró el emoji a modificar';

				if (!role)
					return 'El rol ingresado no es válido';

				const modified = await emoji.edit({ roles: emoji.roles.cache.set(role.id, role) });

				if (!modified) return 'No se encontró el emoji modificado';
				return `Creé ${modified?.name} para el server ${modified?.guild.name} ${modified?.toString()} y solo lo podrá usar ${role.name}`;
			}
			catch (error: unknown) {
				if (error instanceof DiscordAPIError)
					switch (error.code) {
					case Constants.APIErrors.UNKNOWN_ROLE:
						return 'Error: Rol desconocido';
						break;
					case Constants.APIErrors.INVALID_ROLE:
						return 'Error: Rol inválido';
						break;
					default:
						return 'Error: Ha sido imposible editar el emoji';
						break;
					}
			}
		else
			return new MessageEmbed()
				.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
				.setColor('RANDOM')
				.setDescription(`Emotes: ${interaction.guild?.emojis.cache.map(e => e.toString()).join(' ')}`)
				.setTimestamp();
	}
};