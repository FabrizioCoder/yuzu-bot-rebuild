import type { SlashCommand } from 'types/slashCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, GuildMember } from 'discord.js';
import { Division } from '../utils/Util.js';

export default <SlashCommand> {
	options: {
		guildOnly: false,
		adminOnly: false,
		information: {
			descr: 'Busca el avatar de un usuario',
			short: 'Busca avatares',
			usage: '[@Mención]'
		}
	},
	division: Division.INFO,
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Busca el avatar de un usuario')
		.addUserOption(option => option.setName('target').setDescription('The user to display').setRequired(true)),

	execute(interaction) {
		const target = interaction.options.getUser('target', true);
		const avatar = target.displayAvatarURL({ size: 1024, dynamic: true });

		return new MessageEmbed()
			.setAuthor(target.tag, avatar)
			.setColor(interaction.member instanceof GuildMember ? interaction.member.displayColor : 'RANDOM')
			.setTitle(`Avatar pedido por ${interaction.user.tag}`)
			.setDescription(`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`)
			.setImage(avatar);
	}
};