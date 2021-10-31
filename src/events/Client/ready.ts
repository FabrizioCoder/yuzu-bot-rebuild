/* eslint-disable @typescript-eslint/indent */

import type { Event } from 'types/event';
import { cache, registerTasks } from '../../utils/Util.js';

export default <Event<'ready'>> {
	kind: 'ready',
	once: true,
	execute(session) {
		registerTasks(session);

		console.group();

			console.info('\x1b[36m%s %s\x1b[0m', 'Logged in as', `${session.user?.username}`);
			console.info('\x1b[36m%s %s\x1b[0m', 'Logged in at', `${session.readyAt?.toLocaleString('en')}`);
			console.info('\x1b[36m%s %s\x1b[0m', 'Loaded ->', `${session.shard?.count} shard(s)`);
			console.info('\x1b[36m%s %s\x1b[0m', 'Loaded ->', `${cache.commands.size} commands`);
			console.info('\x1b[36m%s %s\x1b[0m', 'Loaded ->', `${cache.slashCommands.size} (/) commands`);
			console.info('\x1b[36m%s %s\x1b[0m', 'Loaded ->', `${cache.events.size} events`);
			console.info('\x1b[36m%s %s\x1b[0m', 'Loaded ->', `${cache.monitors.size} monitors`);
			console.info('\x1b[36m%s %s\x1b[0m', 'Loaded ->', `${cache.tasks.size} tasks`);
			console.info('\x1b[36m%s %s\x1b[0m', 'Memory ->', `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`);

		console.groupEnd();
	}
};