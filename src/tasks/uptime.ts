import type { Task } from 'types/task';
import { Milliseconds, Options } from '../utils/Util.js';
import { GuildChannel } from 'discord.js';

export default <Task> {
	name: 'uptime',
	interval: Milliseconds.HOUR,
	execute(session) {
		if (session.uptime) {
			// time
			const weeks = session.uptime / Milliseconds.WEEK;
			const hours = session.uptime / Milliseconds.HOUR;
			const days = session.uptime / Milliseconds.DAY;
			const minutes = session.uptime / Milliseconds.MINUTE;

			// LOG
			// TODO using the sharding
			const guild = session.guilds.cache.get(Options.GUILD_ID);
			const channel = guild?.channels.cache.get(Options.CHANNEL_ID);

			if (channel instanceof GuildChannel && channel.isText()) // eslint-disable-next-line @typescript-eslint/no-empty-function
				channel.send(`El bot ha estado encendido ${weeks | 0} semanas ${days | 0} días ${hours | 0} horas ${minutes | 0} minutos`).then(() => {}, console.error);
		}
	}
};