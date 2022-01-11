import { createMessageCommand, MessageEmbed } from "oasis";
import { avatarURL, getUser } from "discordeno";
import { Category, DiscordColors } from "utils";

createMessageCommand({
  name: "avatar",
  meta: {
    descr: "Busca el avatar de un usuario",
    short: "Busca avatares",
    usage: "[@Mención]",
  },
  category: Category.Info,
  async execute({ bot, message, args: { args } }) {
    const givenId = /\d{18}/g.exec(args.join(" "))?.[0];

    const userId = BigInt(givenId ?? message.authorId.toString());
    const user = bot.users.get(userId) ?? (await getUser(bot, userId));

    if (!user) {
      return "El usuario no se encontró";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 2048 });

    const { embed } = new MessageEmbed()
      .author(`Dueño: ${user.username}#${user.discriminator}`, avatar)
      .color(DiscordColors.Blurple)
      .title(`Avatar pedido por ${message.tag}`)
      .description(`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`)
      .image(avatar);

    return embed;
  },
});
