import type { Monitor } from 'types/monitor';
import { Constants, Message } from 'discord.js';
import monitor from '../OnMessageCreated/commandMonitor.js';

export default <Monitor<typeof Constants.Events.MESSAGE_UPDATE>> {
	name: 'commandMonitorWhenUpdated',
	ignoreBots: true,
	ignoreDM: true,
	kind: Constants.Events.MESSAGE_UPDATE,
	// @ts-ignore
	async execute(oldMessage, newMessage) {
		if (newMessage instanceof Message)
			await monitor.execute(newMessage);
	}
};