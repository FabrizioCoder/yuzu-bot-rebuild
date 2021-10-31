import type { Command } from 'types/command';
import { Util, Permissions, TextChannel } from 'discord.js';
import { Options } from '../../utils/Util.js';
import * as tagController from '../../database/controllers/tag.controller.js';

type Argument = // the arguments passed
	| 'add'
	| 'set'
	| 'new'
	| 'remove'
	| 'delete'
	| 'give'
	| 'gift'
	| 'edit'
	| 'list'
	| 'nsfw'
	| 'global'
	| 'owner';

const isArgument = (arg: unknown): arg is Argument =>
	arg === 'add' ||
	arg === 'set' ||
	arg === 'new' ||
	arg === 'remove' ||
	arg === 'delete' ||
	arg === 'give' ||
	arg === 'gift' ||
	arg === 'edit' ||
	arg === 'list' ||
	arg === 'nsfw' ||
	arg === 'global' ||
	arg === 'owner';

export default <Command> {
	label: 'tag',
	alias: ['t'],
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Crea, edita, borra o modifica tags.',
			short: ':eyes:',
			usage: '[add(name, content) | remove(name) | give(name, @user) | edit(name, content) | list() | nsfw(name) | global(name) | owner(name)] [search] ...'
		}
	},
	execute: () => async (msg, args) => {
		// shortcut
		var obtain = async (content: string) => {

			const res = await tagController.get(content, msg.guild?.id);

			return res;

		};

		if (!msg.guild) return;

		const arg = args?.[0]?.toLowerCase();

		switch (arg) {
		case 'new':
		case 'set':
		case 'add': {
			if (!args?.[1]) {
				await msg.channel.send('Por favor debes especificar un nombre para tu tag');
				return;
			}
			const tag = await obtain(args?.[1]);
			const content = args?.slice(2)?.join(' ');

			if (!tag) {
				if (!content && msg.attachments.size < 1) {
					await msg.channel.send('Escribe algo, no puedo guardar tags vacíos');
					return;
				}
				const output = await tagController.add(msg.guild.id, msg.author.id, content ?? ' ', args?.[1], msg.attachments.map(att => att.url));

				await msg.channel.send(`Añadí el tag ${output.name}`);
			}
			else {
				await msg.reply('ese tag ya existe');
				if (tag.global)
					await msg.reply('ese tag es global');
			}
			break;
		}

		case 'delete':
		case 'remove': {
			if (!args?.[1]) {
				await msg.channel.send('Por favor debes especificar un tag para borrar');
				return;
			}
			const tag = await obtain(args?.[1]);

			if (tag) {
				if (tag.user !== msg.author.id || !msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || msg.author.id !== Options.OWNER_ID) {
					await msg.channel.send('No sos dueño de ese tag');
					return;
				}
				if (tag.global && msg.author.id !== Options.OWNER_ID) {
					await msg.channel.send('El tag es global y no se puede eliminar');
					return;
				}
				await tagController.remove(msg.guild.id, msg.author.id, args?.[1]);
				await msg.channel.send(`Removí el tag ${args[1]}`);
			}

			break;
		}

		case 'give':
		case 'gift': {
			if (!args?.[1]) {
				await msg.channel.send('Por favor debes especificar un tag para regalar');
				return;
			}
			const tag = await obtain(args?.[1]);
			const target = msg.mentions.users.first();

			if (!target)
				await msg.channel.send('No encontré ese usuario');

			else {
				if (!tag) {
					await msg.channel.send('No encontré el tag');
					return;
				}
				await tagController.pass(tag, { server: msg.guild?.id, user: target.id }, tag?.nsfw, tag?.global);
			}

			break;
		}

		case 'edit': {
			if (!args?.[1]) {
				await msg.channel.send('Por favor debes especificar un tag para editar');
				return;
			}
			const tag = await obtain(args?.[1]);
			const content = args?.slice(2)?.join(' ');

			if (tag)
				if (tag.user !== msg.author.id)
					await msg.channel.send('No sos dueño de ese tag');
				else if (!content && msg.attachments.size < 1)
					await msg.channel.send('Por favor debes especificar el contenido del tag');
				else {
					const output = await tagController.edit(tag, {
						content: content ?? '',
						attachments: msg.attachments.map(att => att.url)
					});

					await msg.channel.send(`Edité el tag ${output?.name}`);
				}
			else await msg.channel.send('No encontré ese tag');

			break;
		}

		case 'list': {
			const tags = await tagController.find(msg.guild.id, msg.mentions.users.first()?.id ?? msg.author.id);
			const list = Util.splitMessage(`'TAGS': #\n${tags.map(tag => tag.name).join(', ')}`);

			const output: string[] = [];

			for (const tagsInList of list) output.push(tagsInList);

			await msg.channel.send({ content: output.join(' ') });
			break;
		}

		case 'global': {
			if (!args?.[1]) {
				await msg.channel.send('Por favor debes especificar un tag para convertir');
				return;
			}
			const tag = await obtain(args?.[1]);

			if (!args?.[0])
				await msg.channel.send('Error inesperado');

			if (tag?.user !== Options.OWNER_ID)
				await msg.channel.send('No sos dueño del bot');

			if (tag)
				if (!tag.global) {
					const output = await tagController.edit(tag, {
						content: tag.content,
						attachments: msg.attachments.map(att => att.url)
					}, true, false);

					await msg.channel.send(`Edité el tag ${output?.name} para que se pueda usar en todos los servidores`);
				}
				else {
					const output = await tagController.edit(tag, {
						content: tag.content,
						attachments: msg.attachments.map(att => att.url)
					}, false, false);

					await msg.channel.send(`Edité el tag ${output?.name} para que ya no se pueda usar en todos los servidores`);
				}
			else await msg.channel.send('No encontré ese tag');

			break;
		}

		case 'nsfw': {
			if (!args?.[1]) {
				await msg.channel.send('Por favor debes especificar un tag para convertir');
				return;
			}
			const tag = await obtain(args?.[1]);

			if (!args?.[1])
				await msg.channel.send('Por favor debes especificar el tag que querés volver nsfw');

			if (tag)
				if (tag.user !== msg.author.id && !msg.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
					await msg.channel.send('No sos dueño de ese tag');

				else if (tag.global)
					await msg.channel.send('No se puede mostrar un tag global si es nsfw');

				else {
					const output = await tagController.edit(tag, { content: tag.content, attachments: tag.attachments }, false, true);

					await msg.channel.send(`Edité el tag ${output?.name} para que se pueda usar solo en canales nsfw`);
				}
			else await msg.channel.send('No encontré ese tag');

			break;
		}

		case 'owner': {
			if (!args?.[1]) {
				await msg.channel.send('Por favor debes especificar un tag');
				return;
			}
			const tag = await obtain(args?.[1]);

			if (tag)
				await msg.channel.send(`ID: ${tag.user}`);

			else await msg.channel.send('No encontré ese tag');

			break;
		}

		default:
			if (!!arg && !isArgument(arg)) {
				const tagGlobal = await tagController.get(arg);
				const tag = await tagController.get(arg, msg.guild.id);

				if (tag) {
					const safe = msg.channel instanceof TextChannel ? !msg.channel.nsfw : false;

					if (tag?.nsfw && !safe) { // eslint-disable-line
						await msg.channel.send('Contenido nsfw, lo sentimos pero no se puede mostrar en éste canal :underage:');
						return;
					}
					await msg.channel.send({ content: tag.content, files: tag.attachments });
					return;
				}
				if (tagGlobal) {
					await msg.channel.send({ content: tagGlobal.content, files: tagGlobal.attachments });
					return;
				}
			}
			break;
		}
		return undefined;
	}
};