/* Expermiental */

import { type SlashContext, Command, MessageEmbed } from "oasis";
import { ApplicationCommandOptionTypes, avatarURL, getUser } from "discordeno";
import { Category, DiscordColors } from "utils";

@Command({
  name: "avatar",
  description: "Busca el avatar de un usuario",
  meta: {
    descr: "Busca el avatar de un usuario",
    short: "Busca avatares",
    usage: "[@Mención]",
  },
  category: Category.Info,
  options: [{
    type: ApplicationCommandOptionTypes.User,
    name: "target",
    description: "The user",
  }],
})
export default abstract class {
  static async execute({ bot, interaction }: SlashContext) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.User) {
      return;
    }

    const userId = !option.value ? interaction.user.id : BigInt(option.value as string);
    const user = bot.users.get(userId) ?? await getUser(bot, userId);

    if (!user) {
      return "Especifica el usuario correctamente";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, {
      avatar: user.avatar,
      size: 2048,
    });

    const embed = MessageEmbed
      .new()
      .author(`Dueño: ${user.username}#${user.discriminator}`, avatar)
      .color(DiscordColors.Blurple)
      .title(`Avatar pedido por ${interaction.user.username}#${interaction.user.discriminator}`)
      .description(`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`)
      .image(avatar)
      .end();

    return embed;
  }
}
