import type { Task } from 'types/task';
import { Milliseconds } from '../utils/Util.js';
import { Constants } from 'discord.js';

export default <Task> {
	name: 'presences',
	interval: Milliseconds.MINUTE * 4,
	async execute(session) {
		const totalGuilds = <number[] | undefined> await session.shard?.fetchClientValues('guilds.cache.size');
		const totalMembers = await session.shard?.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));

		if (!totalGuilds) return;
		if (!totalMembers) return;

		const guildCount =
			totalGuilds?.reduce((acc, gCount) => acc + gCount, 0);

		const memberCount =
			totalMembers?.reduce((acc, mCount) => acc + mCount, 0);

		const presences = [
			`!help`,
			`${guildCount.toLocaleString('de-CH')} servers`,
			`${memberCount.toLocaleString('de-CH')} users`
		];

		session.user?.setPresence({
			status: 'online',
			activities: [
				{
					name: presences[Math.floor(Math.random() * presences.length - 1) + 1],
					type: Constants.ActivityTypes.LISTENING
				}
			]
		});
	}
};