import type { Command } from 'types/command';

export default <Command> {
	label: 'edited',
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Wtf',
			short: '._.XD',
			usage: ''
		}
	},
	execute: () => msg => {
		void msg.channel.send('Hola!').then(m => m.edit('   ‫  Hola    ‫  '));
	}
};