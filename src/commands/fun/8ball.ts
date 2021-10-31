import type { Command } from 'types/command';
import { MessageEmbed } from 'discord.js';

const rpts = ['Sí', 'No', 'Tal vez', 'No sé', '¡Claro!', 'Podría ser', 'Es poco probable', 'Quizás'];

export default <Command> {
	label: '8ball',
	alias: [`${rpts.length}ball`],
	options: {
		guildOnly: false,
		adminOnly: false
	},
	execute: () => (msg, args) => {
		const question = args.join(' ');

		if (!question)
			return 'Por favor pregúntame algo';

		return new MessageEmbed()
			.setColor('RANDOM')
			.addField(String.raw`\🎱 8ball`, '\u200b')
			.setThumbnail(msg.author.displayAvatarURL())
			.addField('Tu pregunta fue:', question)
			.addField('Mi respuesta es:', rpts[Math.floor(Math.random() * rpts.length)] ?? 'Ninguna');
	}
};