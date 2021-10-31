/* eslint-disable */

import type { Command } from 'types/command';
import Discord, { MessageEmbed } from 'discord.js';

// @ts-ignore noUnusedLocals
import fs from 'fs';
import typescript from 'typescript';
import util from 'util';

export default <Command> {
	label: 'eval',
	options: {
		guildOnly: true,
		adminOnly: true
	},
	execute: session => (message, args) => {
		const input = Discord.Util.escapeMarkdown(
			args?.join(' '),
			{
				codeBlock: true,
				codeBlockContent: true
			}
		);

		if (!input)
			return 'Escribe algo.';

		const compiled = typescript.transpile(input, { target: typescript.ScriptTarget.ESNext, module: typescript.ModuleKind.ESNext });
		const output = eval(compiled);

		return new MessageEmbed()
			.setColor('BLURPLE')
			.setTimestamp()
			.setAuthor(
				message.author.tag,
				message.author.displayAvatarURL()
			)
			.addField(
				'Código a Javascript 🖥', `\`\`\`ts\n${compiled}\`\`\``
			)
			.addField(
				'Latencia ⌛', `\`\`\`ts\n${session.ws.ping}ms\`\`\``
			)
			.addField(
				'Entrada 📥', `\`\`\`ts\n${input}\`\`\``
			)
			.addField(
				'Salida 📤', `\`\`\`ts\n${util.inspect(output)}\`\`\``
			)
			.addField(
				'Tipo 📋', `\`\`\`ts\n${typeof output}\`\`\``
			);
	}
};