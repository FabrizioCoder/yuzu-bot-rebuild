import type { Monitor } from 'types/monitor';
import { Options, cache, Milliseconds } from '../../utils/Util.js';
import { MessageEmbed, Constants } from 'discord.js';
import * as Controller from '../../database/controllers/prefix.controller.js';

export default <Monitor<typeof Constants.Events.MESSAGE_CREATE>> {
	name: 'commandMonitor',
	ignoreBots: true,
	ignoreDM: true,
	kind: Constants.Events.MESSAGE_CREATE,
	async execute(message) {
		// get the prefix from the database
		const prefix = !message.guild ? Options.PREFIX : (await Controller.get(message.guild.id))?.prefix ?? Options.PREFIX;

		// arguments, ej: .command args0 args1 args2 ...
		const args = message.content.slice(prefix.length).trim().split(/\s+/gm);
		const name = args.shift()?.toLowerCase();

		if (!name) return;

		const command = cache.commands.get(name) ?? cache.commands.get(cache.aliases.get(name) as string);

		if (!message.content.startsWith(prefix))
			return;

		// COMMAND EXECUTION

		if (!command) {
			await message.channel.send('Ese comando no existe \\🔒');
			return;
		}

		if (command.options?.adminOnly && message.author.id !== Options.OWNER_ID) {
			await message.channel.send('No sos el dueño del bot');
			return;
		}

		if (command.options?.guildOnly && !message.guild) {
			await message.channel.send('Ese comando solo se puede ejecutar dentro de un servidor');
			return;
		}

		const timestamps = cache.cooldowns.get(command.label);

		if (message.guild) {
			if (timestamps?.has(message.guild.id)) {
				const expirationTime = (command.cooldown ?? 3) * Milliseconds.SECOND + <number> timestamps?.get(message.guild.id);

				if (Date.now() < expirationTime) {
					const timeLeft = new Date(expirationTime - Date.now()).getSeconds();

					await message.reply(`Estoy re caliente como para poder ejecutar más comandos \\🔥\nEspera **${timeLeft.toString()}s** antes volver a usar **${command.label}**`);
					return;
				}
			}
			setTimeout(() => timestamps?.delete(message.guild?.id as string), (command.cooldown ?? 3) * Milliseconds.SECOND);
			timestamps?.set(message.guild.id, Date.now());
		}

		const output = await command.execute(message.client)(message, args);

		if (!output)
			return;

		if (output instanceof MessageEmbed)
			await message.channel.send({ embeds: [ output ] });

		else
			await message.channel.send(output);
	}
};