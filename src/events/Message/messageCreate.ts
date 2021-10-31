import type { Event } from 'types/event';
import { cache } from '../../utils/Util.js';
import { Constants, DiscordAPIError, Permissions, GuildChannel } from 'discord.js';

export default <Event<typeof Constants.Events.MESSAGE_CREATE>> {
	kind: Constants.Events.MESSAGE_CREATE,
	execute(message) {
		cache.monitors.forEach(async monitor => {
			// execute every monitor
			try {
				if (!message.guild?.me?.permissions.has(Permissions.FLAGS.SEND_MESSAGES))
					return;

				if (message.channel.type === Constants.ChannelTypes[0] && message.channel instanceof GuildChannel)
					if (!message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES))
						return;

				if (monitor.ignoreBots && message.author.bot) return;
				if (monitor.ignoreDM && !message.guild) return;
				if (monitor.kind !== Constants.Events.MESSAGE_CREATE) return;

				await monitor.execute(message);
			}
			// handle common issues...
			catch (error: unknown) {
				if (error instanceof DiscordAPIError)
					switch (error.code) {
					case Constants.APIErrors.MISSING_PERMISSIONS:
						message.channel?.send({ content: 'Error: Sin permisos' })
							.then(m => console.log('Reported issue: %s', m.content))
							.catch(void 0);
						return;
						break;
					case Constants.APIErrors.UNKNOWN_MESSAGE:
						message.channel?.send({ content: 'Error: Mensaje desconocido' })
							.then(m => console.log('Reported issue: %s', m.content))
							.catch(void 0);
						return;
						break;
					case Constants.APIErrors.CANNOT_SEND_EMPTY_MESSAGE:
						message.channel?.send({ content: 'Error: El bot no puede enviar un mensaje vacío' })
							.then(m => console.log('Reported issue: %s', m.content))
							.catch(void 0);
						return;
						break;
					default:
						message.channel?.send({ content: 'Error: desconocido (por favor contacte al dev)' })
							.then(m => console.log('Reported issue: %s', m.content))
							.catch(void 0);
						return;
						break;
					}
				await message.channel.send({ content: 'There was an error while executing this command!' });
			}
		});
	}
};