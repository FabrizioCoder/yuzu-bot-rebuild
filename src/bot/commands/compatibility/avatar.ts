import type { Context } from "oasis";
import { Command, MessageEmbed } from "oasis";
import { avatarURL, getUser } from "discordeno";
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
})
export default class {
  static async execute({ bot, message, args: { args } }: Context<false>) {
    const givenId = /\d{18}/g.exec(args.join(" "))?.[0];

    const userId = BigInt(givenId ?? message.authorId.toString());
    const user = bot.users.get(userId) ?? await getUser(bot, userId);

    if (!user) {
      return "El usuario no se encontró";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 2048 });

    return MessageEmbed
      .new()
      .author(`Dueño: ${user.username}#${user.discriminator}`, avatar)
      .color(DiscordColors.Blurple)
      .title(`Avatar pedido por ${message.tag}`)
      .description(`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`)
      .image(avatar)
      .end();
  }
}
