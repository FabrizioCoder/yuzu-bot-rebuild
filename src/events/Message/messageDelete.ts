import type { Event } from 'types/event';
import { cache } from '../../utils/Util.js';
import { DiscordAPIError, Constants } from 'discord.js';

export default <Event<typeof Constants.Events.MESSAGE_DELETE>> {
	kind: Constants.Events.MESSAGE_DELETE,
	execute(message) {
		cache.monitors.forEach(async monitor => {
			try {
				if (monitor.kind === Constants.Events.MESSAGE_DELETE)
					await monitor.execute(message);
			}
			catch (error: unknown) {
				if (error instanceof DiscordAPIError)
					if (error.code === Constants.APIErrors.UNKNOWN_MESSAGE)
						message.channel.send('Error: Mensaje desconocido')
							.then(m => console.log('Reported issue: %s', m.content))
							.catch(void 0);
					else
						message.channel?.send({ content: 'Error: desconocido (por favor contacte al dev)' })
							.then(m => console.log('Reported issue: %s', m.content))
							.catch(void 0);
			}
		});
	}
};