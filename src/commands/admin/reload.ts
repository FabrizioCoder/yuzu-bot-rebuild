import type { Command } from 'types/command';
import { Options, loadCommands } from '../../utils/Util.js';

export default <Command> {
	label: 'reload',
	options: {
		guildOnly: true,
		adminOnly: true
	},
	execute: session => async (_, args) => {
		const [ sessionId, guildId ] = args;
		const commands = await loadCommands(session.token ?? Options.TOKEN, sessionId, guildId);

		return `Okay! I tried to reload ${commands.length} commands: \`${commands.join(', ')}\``;
	}
};