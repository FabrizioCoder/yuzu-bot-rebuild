import type { User } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { Division } from './Constants.js';
import * as cache from './cache.js';
import axios from 'axios';

const api = 'https://nekos.life/api/v2/';
const endpoints: `img/${string}`[] = [
	'img/hug',
	'img/kiss',
	'img/poke',
	'img/tickle',
	'img/pat',
	'img/cuddle',
	'img/punch'
];

endpoints.forEach(async cmd => {
	const commandName = cmd.slice(4, cmd.length);
	const getDescription = (action: string, author: User, user: User) => `${author} received a ${action} from ${user}`;

	type Image = { url: `https://cdn.nekos.life/${string}.gif` };
	const { data } = await axios.get<Image | undefined>(api + cmd);

	cache.slashCommands.set(commandName, {
		options: {
			guildOnly: false,
			adminOnly: false,
			information: {
				descr: `To ${commandName}`,
				usage: `[@User]`,
				short: `To ${commandName}`
			}
		},
		division: Division.INTERACTION,
		data: new SlashCommandBuilder()
			.setName(commandName)
			.setDescription(`To ${commandName}`)
			.addUserOption(option => option.setName('target').setDescription('The user to display').setRequired(true)),

		execute: i => {
			if (!data?.url)
				return 'No encontré una imagen para mostrar';

			const user = i.options.getUser('target', true);

			return new MessageEmbed()
				.setDescription(getDescription(commandName, i.user, user))
				.setColor('RANDOM')
				.setImage(data.url);
		}
	});

	cache.commands.set(commandName, {
		label: commandName,
		options: {
			guildOnly: false,
			adminOnly: false,
			information: {
				descr: `To ${commandName}`,
				usage: `[@User]`,
				short: `To ${commandName}`
			}
		},
		cooldown: 4,
		execute: session => msg => {
			if (!data?.url)
				return 'No encontré una imagen para mostrar';

			const user = msg.mentions.users?.first() ?? session.user as User;

			return new MessageEmbed()
				.setDescription(getDescription(commandName, msg.author, user))
				.setColor('RANDOM')
				.setImage(data.url);
		}
	});
});