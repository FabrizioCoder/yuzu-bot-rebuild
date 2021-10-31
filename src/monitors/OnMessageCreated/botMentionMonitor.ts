import type { Monitor } from 'types/monitor';
import { Options } from '../../utils/Util.js';
import { Constants } from 'discord.js';
import * as Controller from '../../database/controllers/prefix.controller.js';

export default <Monitor<typeof Constants.Events.MESSAGE_CREATE>> {
	name: 'botMentionMonitor',
	ignoreBots: true,
	ignoreDM: false,
	kind: Constants.Events.MESSAGE_CREATE,
	async execute(message) {
		const prefix = !message.guild ? Options.PREFIX : (await Controller.get(message.guild.id))?.prefix ?? Options.PREFIX;
		const mention = new RegExp(`^<@!?${message.client.user?.id}>( |)$`);

		if (message.content.match(mention))
			await message.channel.send(`Mi prefix es ${prefix}`);
	}
};