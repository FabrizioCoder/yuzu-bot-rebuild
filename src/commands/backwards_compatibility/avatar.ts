import type { Command } from "../../types/command.ts";
import type { Embed } from "../../../deps.ts";
import { DiscordColors, Division } from "../../utils/mod.ts";
import { avatarURL } from "../../../deps.ts";

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Busca el avatar de un usuario",
      short: "Busca avatares",
      usage: "[@Mención]",
    },
  },
  // TODO
  disabled: true,
  division: Division.UTIL,
  data: {
    name: "avatar",
  },
  async execute(bot, message, { args }) {
    const option = (/\d{18}/g).exec(args.join(" "))?.[0];

    const userId = BigInt(option ?? message.authorId.toString());
    const user = bot.users.get(userId);

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
      description:
        `[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`,
      image: { url: avatar },
    };
  },
};
