import type { Command } from "../../types/command.ts";
import type { Embed } from "discordeno";
import { Category, DiscordColors } from "utils";
import { avatarURL, getUser } from "discordeno";

export default <Command<false>> {
  options: {
    isGuildOnly: false,
    isAdminOnly: false,
    information: {
      descr: "Busca el avatar de un usuario",
      short: "Busca avatares",
      usage: "[@Mención]",
    },
  },
  category: Category.Info,
  data: {
    name: "avatar",
  },
  async execute({ bot, message, args }) {
    const givenId = /\d{18}/g.exec(args.args.join(" "))?.[0];

    const userId = BigInt(givenId ?? message.authorId.toString());
    const user = bot.users.get(userId) ?? await getUser(bot, userId);

    if (!user) return "El usuario no se encontró";

    const avatar = avatarURL(bot, user.id, user.discriminator, {
      avatar: user.avatar,
      size: 2048,
    });

    return <Embed> {
      author: {
        name: `Dueño: ${user.username}#${user.discriminator}`,
        iconURL: avatar,
      },
      color: DiscordColors.Blurple,
      description: `[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`,
      image: { url: avatar },
    };
  },
};
