/* eslint-disable no-unsafe-finally */

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { slashCommands } from './cache.js';
import { Options, Division } from './Constants.js';

export async function loadCommands(token: string, sessionId?: string, guildId?: string): Promise<string[]> {
	const rest = new REST({ version: '9' }).setToken(token);
	const data = [ ...slashCommands.values() ].filter(cmd => cmd.division !== Division.OWNER);

	try {
		await rest.put(Routes.applicationCommands(sessionId ?? Options.SESSION_ID), {
			body: data.map(cmd => cmd.data.toJSON())
		});

		await rest.put(Routes.applicationGuildCommands(sessionId ?? Options.SESSION_ID, guildId ?? Options.GUILD_ID), {
			body: data.map(cmd => cmd.data.toJSON())
		});

		console.log('Successfully reloaded application (/) commands.');
	}
	catch (err: unknown) {
		if (err instanceof Error)
			console.error('Cannot reload application (/) commands: %s', err.message);
	}
	finally {
		return data.map(c => c.data.name);
	}
}