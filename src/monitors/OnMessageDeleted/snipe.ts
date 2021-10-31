import type { Monitor } from 'types/monitor';
import { cache } from '../../utils/Util.js';
import { Constants, Message } from 'discord.js';

export default <Monitor<typeof Constants.Events.MESSAGE_DELETE>> {
	name: 'snipedMessage',
	ignoreBots: true,
	ignoreDM: false,
	kind: Constants.Events.MESSAGE_DELETE,
	execute(message) {
		if (message.deleted && message instanceof Message) {
			if (message.content.length > 1000) return;
			cache.snipedMessages.sweep((_, ch) => ch === message.channel.id);
			cache.snipedMessages.set(message.channel.id, message);
		}
	}
};