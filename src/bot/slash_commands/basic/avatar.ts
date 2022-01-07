import type { Context } from "oasis";
import { Command, MessageEmbed, Option } from "oasis";
import { ApplicationCommandOptionTypes, avatarURL, getUser } from "discordeno";
import { Category, DiscordColors } from "utils";

@Option({
  type: ApplicationCommandOptionTypes.User,
  name: "target",
  description: "The user",
})
@Command({
  name: "avatar",
  description: "Busca el avatar de un usuario",
  meta: {
    descr: "Busca el avatar de un usuario",
    short: "Busca avatares",
    usage: "[@Mención]",
  },
  category: Category.Info,
})
export default class {
  static async execute({ bot, interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.User) {
      return;
    }

    const userId = !option ? interaction.user.id : BigInt(option.value as string);
    const user = bot.users.get(userId) ?? await getUser(bot, userId);

    if (!user) {
      return "Especifica el usuario correctamente";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, {
      avatar: user.avatar,
      size: 2048,
    });

    return MessageEmbed
      .new()
      .author(`Dueño: ${user.username}#${user.discriminator}`, avatar)
      .color(DiscordColors.Blurple)
      .title(`Avatar pedido por ${interaction.user.username}#${interaction.user.discriminator}`)
      .description(`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`)
      .image(avatar)
      .end();
  }
}
