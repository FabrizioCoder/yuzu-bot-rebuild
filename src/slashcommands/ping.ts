import type { SlashCommand } from 'types/slashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Division } from '../utils/Util.js';

export default <SlashCommand> {
	options: {
		guildOnly: false,
		adminOnly: false,
		information: { descr: 'Ping', short: 'Ping', usage: '' }
	},
	division: Division.UTIL,
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	execute: interaction => `pong! \\🏓 ${Math.floor(interaction.client.ws.ping)}ms`
};