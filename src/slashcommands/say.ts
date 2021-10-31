import type { SlashCommand } from 'types/slashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Util } from 'discord.js';
import { Division } from '../utils/Util.js';

export default <SlashCommand> {
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Hace que el bot diga algo muy malo',
			short: 'Escribir el mensaje del bot',
			usage: '<Texto>'
		}
	},
	division: Division.FUN,
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Escribir el siguiente mensaje del bot')
		.addStringOption(option => option.setName('text').setDescription('Bot\'s message').setRequired(true)),

	execute(interaction): string | void {
		const text = interaction.options.getString('text');

		if (text) return Util.removeMentions(text);
	}
};