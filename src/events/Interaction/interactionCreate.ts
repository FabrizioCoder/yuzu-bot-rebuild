import type { Event } from 'types/event';
import { cache, Division, Emoji } from '../../utils/Util.js';
import { MessageEmbed, GuildChannel, Permissions, Constants, DiscordAPIError, MessageActionRow } from 'discord.js';

export default <Event<typeof Constants.Events.INTERACTION_CREATE>> {
	kind: Constants.Events.INTERACTION_CREATE,
	async execute(interaction) {
		// TODO
		if (interaction.isSelectMenu()) {
			if (interaction.customId === 'HelpMenu') {
				const baseEmbed = interaction.message.embeds[0];

				if (!baseEmbed)
					return;

				const embed = Object.assign(<MessageEmbed> Object.create(baseEmbed), baseEmbed);

				const cmd = interaction.values[0];
				const row = interaction.message.components?.[0];

				if (row instanceof MessageActionRow) {

					if (cmd) {
						const command = cache.slashCommands.get(cmd);

						if (command) {
							embed.setTitle('Información del comando.');
							embed.setFields([
								{
									name: 'Categoría',
									value: `${Emoji[`:category_${Division[command.division]?.toLowerCase()}:` as keyof typeof Emoji]} ${Division[command.division]?.toLowerCase()}`,
									inline: true
								},
								{
									name: 'Información',
									value: command.options?.information?.descr ?? command.options?.information?.short ?? 'Comando sin descripción',
									inline: true
								},
								{
									name: 'Uso',
									value: `/${command.data.name} ${command.options?.information?.usage ?? ''}`,
									inline: true
								},
								{
									name: 'Nombre',
									value: `/${command.data.name}`,
									inline: true
								},
								{
									name: 'Opciones',
									value: Number(command.data.toJSON().options?.length) > 0 ? `${command.data.toJSON()?.options?.map(o => `\`${o.name}\` [${o.description}]`).join('\n')}` : '...'
								},
								{
									name: 'Comandos similares',
									value: `\`\`\`ini\n${
										cache.slashCommands
											.filter(c => Division[c.division] === Division[command.division])
											.filter(c => c.data.name !== command.data.name)
											.map(c => `${c.data.name} (${c.options?.information?.short ?? c.options?.information?.descr})`)
											.sort()
											.join('\n')}\`\`\``
								},
								{
									name: 'Importante',
									value: '```diff\n!help (Para otros comandos)```'
								}
							]);
						}
					}
					try {
						await interaction.update({ embeds: [ embed ], components: [ row ] });
					}
					catch (error: unknown) {
						return; // eslint-disable-line no-useless-return
					}
				}
			}
		}
		else if (interaction.isCommand()) {

			await interaction.deferReply();

			const command = cache.slashCommands.get(interaction.commandName);

			if (!command)
				return;

			if (!interaction.guild && command.options?.guildOnly === true)
				return;

			try {
				const output = await command.execute(interaction);

				if (!output)
					return;

				// PERMISSIONS

				if (!interaction.guild?.me?.permissions.has(Permissions.FLAGS.SEND_MESSAGES))
					return;

				if (interaction.channel?.type === Constants.ChannelTypes[0] && interaction.channel instanceof GuildChannel)
					if (!interaction.channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.SEND_MESSAGES))
						return;

				if (!interaction.guild?.me?.permissions.has(Permissions.FLAGS.READ_MESSAGE_HISTORY))
					return;

				if (interaction.channel?.type === Constants.ChannelTypes[0] && interaction.channel instanceof GuildChannel)
					if (!interaction.channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.READ_MESSAGE_HISTORY))
						return;

				// END PERMISSIONS

				if (output instanceof MessageEmbed) {
					if (!interaction.guild?.me?.permissions.has(Permissions.FLAGS.EMBED_LINKS))
						return;

					if (interaction.channel?.type === Constants.ChannelTypes[0] && interaction.channel instanceof GuildChannel)
						if (!interaction.channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.EMBED_LINKS))
							return;

					await interaction.editReply({ embeds: [ output ] });
					return;
				}

				else if (typeof output === 'string') {
					await interaction.editReply({ content: output });
					return;
				}

				else {
					if (!interaction.guild?.me?.permissions.has(Permissions.FLAGS.EMBED_LINKS))
						return;

					if (interaction.channel?.type === Constants.ChannelTypes[0] && interaction.channel instanceof GuildChannel)
						if (!interaction.channel.permissionsFor(interaction.guild.me).has(Permissions.FLAGS.EMBED_LINKS))
							return;

					await interaction.editReply(output);
					return;
				}
			}
			catch (error: unknown) {
				if (error instanceof DiscordAPIError)
					switch (error.code) {
					case Constants.APIErrors.MISSING_PERMISSIONS:
						interaction.channel?.send({ content: 'Error: Sin permisos' })
							.catch(void 0);
						return;
						break;
					case Constants.APIErrors.UNKNOWN_MESSAGE:
						interaction.channel?.send({ content: 'Error: Mensaje desconocido' })
							.catch(void 0);
						return;
						break;
					case Constants.APIErrors.CANNOT_SEND_EMPTY_MESSAGE:
						interaction.channel?.send({ content: 'Error: El bot no puede enviar un mensaje vacío' })
							.catch(void 0);
						return;
						break;
					case Constants.APIErrors.UNKNOWN_INTERACTION:
						interaction.channel?.send({ content: 'Error: Interacción desconocida, no pude responder' })
							.catch(void 0);
						return;
						break;
					default:
						interaction.channel?.send({ content: 'Error: Desconocido (por favor contacte al dev) ' + error.message })
							.catch(void 0);
						return; // eslint-disable-line no-useless-return
						break;
					}
			}
		}
	}
};