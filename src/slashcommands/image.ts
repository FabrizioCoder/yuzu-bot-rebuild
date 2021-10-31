import type { SlashCommand } from 'types/slashCommand';
import type { MessageComponentInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, TextChannel, MessageActionRow, MessageButton, Message } from 'discord.js';
import { Division, Milliseconds } from '../utils/Util.js';
import { image_search as imageSearch } from 'duckduckgo-images-api';

export default <SlashCommand> {
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: 'Busca imágenes en internet',
			short: 'Busca imágenes',
			usage: '<Search>'
		}
	},
	division: Division.FUN,
	data: new SlashCommandBuilder()
		.setName('image')
		.setDescription('Busca imágenes en internet')
		.addStringOption(option => option.setName('search').setDescription('The search').setRequired(true)),

	async execute(interaction) {
		const search = interaction.options.getString('search', true);

		const safe = interaction.channel instanceof TextChannel ? !interaction.channel.nsfw : true;
		const results = await imageSearch({ query: search, moderate: safe });

		if (!results[0] || results.length <= 0)
			return 'No he encontrado resultados';

		// BUTTONS

		const buttonGoBack = new MessageButton()
			.setCustomId('Back')
			.setEmoji('◀')
			.setStyle('PRIMARY')
			.setDisabled(true);

		const buttonGoNext = new MessageButton()
			.setCustomId('Next')
			.setEmoji('▶')
			.setStyle('PRIMARY')
			.setDisabled(false);

		const buttonExactMatch = new MessageButton()
			.setCustomId('ExactMatch')
			.setEmoji('#️⃣')
			.setLabel('Pages')
			.setStyle('PRIMARY');

		const buttonDelete = new MessageButton()
			.setCustomId('Delete')
			.setEmoji('✖')
			.setStyle('DANGER');

		const row = new MessageActionRow()
			.addComponents([ buttonGoBack, buttonGoNext, buttonExactMatch, buttonDelete ]);

		// END BUTTONS

		const baseEmbed = new MessageEmbed()
			.setColor('RANDOM')
			.setImage(results[0].image)
			.addField('Safe search:', safe ? 'on' : 'off')
			.setFooter(`Results for ${search}`)
			.setAuthor(interaction.user.username, interaction.user.displayAvatarURL());

		if (!safe)
			baseEmbed.setDescription(`[${results[0].title}](${results[0].url})`);

		const querySize = results.length - 1;
		const message = await interaction.editReply({ embeds: [ baseEmbed ], components: [ row ] });

		// eslint-disable-next-line vars-on-top
		var query = 0;

		// collector filter
		const interactionFilter = (i: MessageComponentInteraction) =>
			interaction.user.id === i.user.id &&
			(
				i.customId === 'Back' ||
				i.customId === 'Next' ||
				i.customId === 'ExactMatch' ||
				i.customId === 'Delete'
			);

		// collector
		const componentCollector = interaction.channel?.createMessageComponentCollector(
			{
				filter: interactionFilter,
				time: Milliseconds.SECOND * 45
			}
		);

		componentCollector?.on('collect', async button => {
			if (!button.isButton()) return;

			// clone the embed
			const embed = Object.assign(Object.create(baseEmbed) as MessageEmbed, baseEmbed);

			if (button.customId === 'Back' && message.id === button.message.id) {
				await button.deferUpdate();
				query--;
				const response = results[query];

				if (response) {
					// set disabled
					row.components[0]?.setDisabled(query <= 0);
					row.components[1]?.setDisabled(query >= querySize);
					embed.setImage(response.image);
					embed.setFooter(`Page: ${query}/${querySize}`);
					if (!safe) // sometimes it links to NSFW content
						embed.setDescription(`[${response.title}](${response.url})`);

					componentCollector.resetTimer();
					await button.editReply({ embeds: [ embed ], components: [ row ] });
				}
			}
			else if (button.customId === 'Next' && message.id === button.message.id) {
				await button.deferUpdate();
				query++;
				const response = results[query];

				if (response) {
					// set disabled
					row.components[0]?.setDisabled(query <= 0);
					row.components[1]?.setDisabled(query >= querySize);
					embed.setImage(response.image);
					embed.setFooter(`Page: ${query}/${querySize}`);
					if (!safe)
						embed.setDescription(`[${response.title}](${response.url})`);

					componentCollector.resetTimer();
					await button.editReply({ embeds: [ embed ], components: [ row ] });
				}
			}
			else if (button.customId === 'ExactMatch' && message.id === button.message.id) {
				await button.deferUpdate();
				await interaction.channel?.send({ content: `Envía por favor un número entre 0 y ${querySize}` });

				const messageFilter = (m: Message) => !isNaN(parseInt(m.content)) && m.author.id === interaction.user.id;
				const messageCollector = interaction.channel?.createMessageCollector(
					{
						filter: messageFilter,
						time: Milliseconds.SECOND * 15
					}
				);

				componentCollector.resetTimer();

				// search certain pages
				messageCollector?.on('collect', async receivedPage => {
					query = parseInt(receivedPage.content);

					const response = results[query];

					if (response) {
						// set disabled
						row.components[0]?.setDisabled(query <= 0);
						row.components[1]?.setDisabled(query >= querySize);
						embed.setImage(response.image);
						embed.setFooter(`Page: ${query}/${querySize}`);
						if (!safe)
							embed.setDescription(`[${response.title}](${response.url})`);

						await button.editReply({ embeds: [ embed ], components: [ row ] });
					}
				});
				messageCollector?.on('end', async collected => {
					await button.deferUpdate();
					// type guards
					if (interaction.channel instanceof TextChannel) {
						await interaction.channel.send('Ok...');
						await interaction.channel.bulkDelete(collected); // delete all messages received
					}
					await button.editReply({ embeds: [ embed ], components: [ row ] });
				});
			}
			else if (button.customId === 'Delete' && message.id === button.message.id) {
				// type guards
				if (message instanceof Message)
					await message.delete();
			}
		});
		return undefined;
	}
};