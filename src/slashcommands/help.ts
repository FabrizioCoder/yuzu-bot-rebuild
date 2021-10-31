import type { SlashCommand } from 'types/slashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageActionRow, MessageSelectMenu, MessageEmbed } from 'discord.js';
import { cache, Division, Emoji, Options } from '../utils/Util.js';
import * as Controller from '../database/controllers/prefix.controller.js';

export default <SlashCommand> {
	options: {
		guildOnly: true,
		adminOnly: false,
		information: {
			descr: '\\📕 Ayuda del bot...',
			short: '\\📕 Ayuda del bot',
			usage: ''
		}
	},
	division: Division.INFO,
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('📕 Ayuda del bot...'),

	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('HelpMenu')
					.setPlaceholder('Nothing selected')
					.addOptions(cache.slashCommands.map(cmd => {
						const category = Division[cmd.division];
						const emoji = Emoji[`:category_${category?.toLowerCase()}:` as keyof typeof Emoji];

						return {
							label: `${cmd.data.name} - ${category?.toLowerCase()}`,
							emoji: emoji,
							description: cmd.options?.information?.descr,
							value: cmd.data.name
						};
					}).sort((a, b) => Number(a.label > b.label) || Number(a.label === b.label) - 1))
			);

		const prefix = !interaction.guild ? Options.PREFIX : (await Controller.get(interaction.guild.id))?.prefix ?? Options.PREFIX;

		const baseEmbed = new MessageEmbed()
			.setColor('BLURPLE')
			.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
			.setDescription(`Mi prefix es: ${prefix}\n${cache.slashCommands.size} comandos`)
			.setThumbnail(interaction.user.displayAvatarURL())
			.setFooter(`${interaction.user.id} <> Required [] Optional`, interaction.user.displayAvatarURL())
			.setTimestamp();

		return { embeds: [ baseEmbed ], components: [ row ] };
	}
};