/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { Command } from 'types/command';
import { MessageEmbed, Util, Permissions, GuildChannel } from 'discord.js';
import axios from 'axios';

interface Song {
	lyrics: string;
	author: string;
	title: string;
	thumbnail: { genius: string };
	links: { genius: string };
}

interface Song {
	error: string;
}

export default <Command> {
	label: 'lyrics',
	alias: ['song', 's'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca la letra e información de una canción.',
			short: 'Busca letras de canciones.',
			usage: '<Letra>'
		}
	},
	execute: () => async (msg, args) => {
		const search = args?.join(' ');

		if (!msg.guild?.me?.permissions.has(Permissions.FLAGS.EMBED_LINKS))
			return 'No tengo permisos';

		if (msg.channel instanceof GuildChannel)
			if (!msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.EMBED_LINKS))
				return 'No tengo permisos';

		if (!search)
			return 'Argumento invalido, escribe algo';

		if (search.length > 150)
			return 'No puedo encontrar títulos tan largos';

		try {
			const { data } = await axios.get<Song>(`https://some-random-api.ml/lyrics/?title=${search}`);

			if (!data || data.error)
				return 'No pude encontrar esa canción master';

			const embed = new MessageEmbed()
				.setTitle(data.title)
				.setAuthor(data.author, data.thumbnail.genius)
				.setColor('RANDOM');

			if (data.lyrics.length > 2048) {
				const toSend = Util.splitMessage(data.lyrics, { maxLength: 2000 });

				if (toSend.length < 3) {
					const embeds = toSend.map(m => Object.assign(<MessageEmbed> Object.create(embed), embed).setFooter(m));

					return { embeds };
				}
				else {
					// eslint-disable-next-line no-await-in-loop
					for (const one of toSend) await msg.channel.send({ embeds: [ Object.assign(<MessageEmbed> Object.create(embed), embed).setFooter(one) ] });
					return;
				}
			}
			else return embed.setFooter(data.lyrics);
		}
		// eslint-disable-next-line @typescript-eslint/no-implicit-any-catch
		catch (_) {
			return 'Error inésperado en la búsqueda';
		}
	}
};