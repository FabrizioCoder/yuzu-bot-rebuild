import type { Client } from 'discord.js';
import * as cache from './cache.js';

// inspired by Discordeno template
export var registerTasks = (client: Client<true>): void => cache.tasks.forEach(task => {
	cache.runningTasks.initialTimeouts.add(
		setTimeout(async () => {
			console.log('Started Task %s', task.name);
			try {
				await task.execute(client);
			}
			catch (err: unknown) {
				if (err instanceof Error) console.error(err.message);
			}
			cache.runningTasks.initialTimeouts.add(
				setInterval(async () => {
					console.log('Started Task %s', task.name);
					try {
						await task.execute(client);
					}
					catch (err: unknown) {
						if (err instanceof Error) console.error(err.message);
					}
				}, task.interval)
			);
		}, task.interval - Date.now() % task.interval)
	);
});

export var clearTasks = (): void => {
	for (const timeout of cache.runningTasks.initialTimeouts)
		clearTimeout(timeout);

	for (const task of cache.runningTasks.intervals)
		clearInterval(task);

	cache.tasks.clear();
	cache.runningTasks.initialTimeouts.clear();
};