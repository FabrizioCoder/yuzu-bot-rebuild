import type { Command, CommandMessageContent } from 'types/command';
import type { MessageComponentInteraction, Message } from 'discord.js';
import { MessageEmbed, MessageActionRow, MessageButton, Permissions, DiscordAPIError, Constants, TextChannel, GuildChannel } from 'discord.js';
import { image_search as imageSearch } from 'duckduckgo-images-api';

export default <Command> {
	cooldown: 4,
	label: 'image',
	alias: ['img', 'im', 'i'],
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca imágenes en internet.',
			short: 'Busca imágenes en internet.',
			usage: '<Search>'
		}
	},
	execute: () => async (msg, args): Promise<CommandMessageContent | undefined> => {
		var image = async (query: string, moderate = true) => {
			const results = await imageSearch({ query, moderate });

			return [ ...results.filter(f => f) ];
		};
		var query = 0;

		if (!msg.guild?.me?.permissions.has(Permissions.FLAGS.EMBED_LINKS))
			return 'No tengo permisos';

		if (msg.channel instanceof GuildChannel)
			if (!msg.channel.permissionsFor(msg.guild.me).has(Permissions.FLAGS.EMBED_LINKS))
				return 'No tengo permisos';

		const search = args.join(' ');

		if (!search)
			return 'Por favor especifica una búsqueda';

		try {
			await msg.react('✅');
			await msg.react('✅');
		}
		catch (error: unknown) {
			if (error instanceof DiscordAPIError)
				switch (error.code) {
				case Constants.APIErrors.REACTION_BLOCKED:
					await msg.channel.send({ content: 'No se ha podido reaccionar' });
					break;
				case Constants.APIErrors.MISSING_PERMISSIONS:
					await msg.channel.send({ content: 'No se ha podido reaccionar' });
					break;
				default:
					return;
				}
		}
		const safe = msg.channel instanceof TextChannel ? !msg.channel.nsfw : true;
		const results = await image(search, safe);

		if (results.length <= 0)
			return 'No he encontrado resultados';

		if (!results[0])
			return 'No he encontrado resultados';

		const row = new MessageActionRow()
			.addComponents([
				new MessageButton()
					.setCustomId('Back')
					.setLabel('⏪')
					.setStyle('PRIMARY')
					.setDisabled(true),
				new MessageButton()
					.setCustomId('Next')
					.setLabel('⏩')
					.setStyle('PRIMARY')
					.setDisabled(false),
				new MessageButton()
					.setCustomId('ExactMatch')
					.setLabel('🔢')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('Delete')
					.setLabel('✖')
					.setStyle('DANGER')
			]);

		const baseEmbed = new MessageEmbed()
			.setColor('RANDOM')
			.setImage(results[0].image)
			.addField('Safe search:', safe ? 'on' : 'off')
			.setFooter(`Results for ${search}`)
			.setAuthor(msg.author.username, msg.author.displayAvatarURL());

		if (!safe) baseEmbed.setDescription(`[${results[0].title}](${results[0].url})`);

		const querySize = results.length - 1;
		const message = await msg.channel.send({ embeds: [ baseEmbed ], components: [ row ] });

		// collector
		const filter = (i: MessageComponentInteraction) => (i.customId === 'Back' || i.customId === 'Next' || i.customId === 'ExactMatch' || i.customId === 'Delete') && i.user.id === msg.author.id;
		const collector = message.channel.createMessageComponentCollector({ filter, time: 25 * 1000 });

		collector.on('collect', async i => {
			const embed = <MessageEmbed> Object.assign(Object.create(baseEmbed), baseEmbed);

			if (i.customId === 'Back' && message.id === i.message.id) {
				query--;
				const response = results[query];

				if (response) {
					row.components[0]?.setDisabled(query <= 0);
					row.components[1]?.setDisabled(query >= querySize);
					embed.setImage(response.image);
					embed.setFooter(`Page: ${query}/${querySize}`);
					if (!safe)
						embed.setDescription(`[${response.title}](${response.url})`);
					collector.resetTimer();
					await i.update({ embeds: [ embed ], components: [ row ] });
				}
			}
			else if (i.customId === 'Next' && message.id === i.message.id) {
				query++;
				const response = results[query];

				if (response) {
					row.components[0]?.setDisabled(query <= 0);
					row.components[1]?.setDisabled(query >= querySize);
					embed.setImage(response.image);
					embed.setFooter(`Page: ${query}/${querySize}`);
					if (!safe)
						embed.setDescription(`[${response.title}](${response.url})`);
					collector.resetTimer();
					await i.update({ embeds: [ embed ], components: [ row ] });
				}
			}
			else if (i.customId === 'ExactMatch' && message.id === i.message.id) {
				await msg.reply(`Please send a number beetween 0 and ${querySize}`);
				const messageFilter = (m: Message) => !isNaN(parseInt(m.content)) && m.author === msg.author;
				const messageCollector = msg.channel.createMessageCollector({ filter: messageFilter, time: 15 * 1000 });

				messageCollector.on('collect', async m => {
					query = parseInt(m.content);
					const response = results[query];

					if (response) {
						row.components[0]?.setDisabled(query <= 0);
						row.components[1]?.setDisabled(query >= querySize);
						embed.setImage(response.image);
						embed.setFooter(`Page: ${query}/${querySize}`);
						if (!safe)
							embed.setDescription(`[${response.title}](${response.url})`);
						collector.resetTimer();
						await message.edit({ embeds: [ embed ], components: [ row ] });
					}
				});
				messageCollector.on('end', async collected => {
					if (msg.channel instanceof TextChannel) {
						await msg.channel.send('Ok...');
						await msg.channel.bulkDelete(collected);
					}
				});
				await i.update({ embeds: [ embed ], components: [ row ] });
			}
			else if (i.customId === 'Delete' && message.id === i.message.id) {
				await i.reply({ content: 'Ok!', ephemeral: true });
				await message.delete();
				collector.stop();
			}
			else collector.stop();
		});
		return undefined;
	}
};