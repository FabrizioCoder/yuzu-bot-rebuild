import type { SlashCommand } from 'types/slashCommand';
import { Permissions, TextChannel, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Options, Division } from '../utils/Util.js';
import * as tagController from '../database/controllers/tag.controller.js';

const data = new SlashCommandBuilder()
	.setName('tag')
	.setDescription('Crea, edita, borra o modifica tags')
	.addSubcommand(command =>
		command
			.setName('add')
			.setDescription('Añade un tag')
			.addStringOption(option => option.setName('name').setDescription('El nombre del tag').setRequired(true))
			.addStringOption(option => option.setName('content').setDescription('El contenido del tag').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('remove')
			.setDescription('Remueve un tag')
			.addStringOption(option => option.setName('name').setDescription('El nombre del tag').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('give')
			.setDescription('Dar un tag a un bro')
			.addUserOption(option => option.setName('user').setDescription('El usuario al que dar el tag').setRequired(true))
			.addStringOption(option => option.setName('name').setDescription('El nombre del tag').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('edit')
			.setDescription('Edita un tag')
			.addStringOption(option => option.setName('name').setDescription('El nombre del tag').setRequired(true))
			.addStringOption(option => option.setName('content').setDescription('El contenido del tag').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('list')
			.setDescription('Muestra todos los tags de un usuario del servidor')
			.addUserOption(option => option.setName('user').setDescription('El usuario al que quieras buscar').setRequired(false))
	)
	.addSubcommand(command =>
		command
			.setName('nsfw')
			.setDescription('Marca un tag como nsfw')
			.addStringOption(option => option.setName('name').setDescription('El nombre del tag').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('owner')
			.setDescription('Muestra el dueño de un tag')
			.addStringOption(option => option.setName('name').setDescription('El nombre del tag').setRequired(true))
	)
	.addSubcommand(command =>
		command
			.setName('display')
			.setDescription('Muestra un tag')
			.addStringOption(option => option.setName('name').setDescription('El nombre del tag').setRequired(true))
	);

export default <SlashCommand> {
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Crea, edita, borra o modifica tags',
			short: ':eyes:',
			usage: '[add(name, content) | remove(name) | give(name, @user) | edit(name, content) | list() | nsfw(name) | global(name) | owner(name)] [search] ...'
		}
	},
	// config
	division: Division.FUN,
	data,

	async execute(interaction) {
		enum Arguments {
			ADD,
			REMOVE,
			GIVE,
			EDIT,
			LIST,
			NSFW,
			OWNER,
			DISPLAY
		}

		const subcommand = interaction.options.getSubcommand();

		if (!interaction.guild?.id)
			return;

		switch (Arguments[subcommand.toUpperCase() as keyof typeof Arguments]) {
		case Arguments.ADD: {
			const name = interaction.options.getString('name', true);
			const content = interaction.options.getString('content', true);

			const tag = await tagController.get(name, interaction.guild.id);

			if (!tag) {
				if (!content)
					return 'Escribe algo, no puedo guardar tags vacíos';

				const output = await tagController.add(interaction.guild.id, interaction.user.id, content, name);

				return `Añadí el tag ${output.name}`;
			}
			else {
				if (tag.global)
					return 'ese tag es global';

				return 'ese tag ya existe';
			}
			break;
		}
		case Arguments.REMOVE: {
			const name = interaction.options.getString('name', true);

			const tag = await tagController.get(name, interaction.guild.id);

			if (tag) {
				const isAdmin = interaction.member instanceof GuildMember && interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

				if (tag.user !== interaction.user.id && !isAdmin && interaction.user.id !== Options.OWNER_ID)
					return 'No sos dueño de ese tag';

				if (tag.global && interaction.user.id !== Options.OWNER_ID)
					return 'El tag es global y no se puede eliminar';

				const output = await tagController.remove(interaction.guild.id, tag.user, name);

				return `Removí el tag ${output?.name}`;
			}
			return 'No encontrè ese tag';
			break;
		}
		case Arguments.GIVE: {
			const user = interaction.options.getUser('user', true);
			const name = interaction.options.getString('name', true);

			const tag = await tagController.get(name, interaction.guild.id);

			if (tag) {
				if (!user)
					return 'No encontré ese usuario';

				if (user.bot)
					return 'Noup..';

				const output = await tagController.pass(tag, { server: interaction.guild.id, user: user.id }, tag.nsfw, tag.global);

				return `${user}! ${interaction.user} te ha regalado el #tag ${output?.name}`;
			}
			return 'No encontré ese tag';
			break;
		}
		case Arguments.EDIT: {
			const name = interaction.options.getString('name', true);
			const content = interaction.options.getString('content', true);

			const tag = await tagController.get(name, interaction.guild.id);

			if (tag) {
				if (tag.user !== interaction.user.id)
					return 'No sos dueño de ese tag';

				const output = await tagController.edit(tag, { content, attachments: [] });

				return `Edité el tag ${output?.name}`;
			}
			return 'No encontrè ese tag';
			break;
		}
		case Arguments.LIST: {
			const user = interaction.options.getUser('user', false);

			const tags = await tagController.find(interaction.guild.id, user?.id ?? interaction.user.id);

			return { content: 'Tags: ' + tags.map(tag => tag.name).join(', '), code: 'ml' };
			break;
		}
		case Arguments.NSFW: {
			const name = interaction.options.getString('name', true);

			const tag = await tagController.get(name, interaction.guild.id);

			if (tag) {
				const isAdmin = interaction.member instanceof GuildMember && interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

				if (tag.user !== interaction.user.id && !isAdmin)
					return 'No sos dueño de ese tag';

				if (tag.global)
					return 'No se puede marcar un tag global';

				const output = await tagController.edit(tag, { content: tag.content, attachments: tag.attachments }, false, !tag.nsfw);

				return `Edité el tag ${output?.name} como **${!output?.nsfw ? 'sfw' : 'nsfw'}**`;
			}
			return 'No encontré ese tag';
			break;
		}
		case Arguments.OWNER: {
			const name = interaction.options.getString('name', true);
			const tag = await tagController.get(name, interaction.guild.id);

			if (tag)
				return `ID: ${tag.user} <@${tag.user}>`;

			return 'No encontré ese tag';
			break;
		}
		case Arguments.DISPLAY: {
			const name = interaction.options.getString('name', true);

			const tagGlobal = await tagController.get(name);

			if (tagGlobal)
				return { content: tagGlobal.content, files: tagGlobal.attachments };

			const tag = await tagController.get(name, interaction.guild.id);

			if (!tag)
				return 'No encontré ese tag';

			const safe = interaction.channel instanceof TextChannel ? !interaction.channel?.nsfw : false;

			if (tag.nsfw && safe)
				return 'Contenido nsfw, lo sentimos pero no se puede mostrar en éste canal :underage:';

			return { content: tag.content, files: tag.attachments };
			break;
		}
		default:
			return 'Eso no es un argumento válido';
		}
	}
};