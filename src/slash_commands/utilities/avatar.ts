import type { Command } from "../../types/command.ts";
import type { Embed } from "../../../deps.ts";

import { Category, DiscordColors } from "../../utils/mod.ts";
import { ApplicationCommandOptionTypes, avatarURL, getUser } from "../../../deps.ts";

export default <Command> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Busca el avatar de un usuario",
      short: "Busca avatares",
      usage: "[@Mención]",
    },
  },
  category: Category.Info,
  data: {
    name: "avatar",
    description: "Busca el avatar de un usuario",
    options: [
      {
        type: ApplicationCommandOptionTypes.User,
        name: "target",
        description: "The user",
      },
    ],
  },
  async execute(bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type === ApplicationCommandOptionTypes.User) {
      const userId = !option.value ? interaction.user.id : BigInt(option.value as string);
      const user = bot.users.get(userId) ?? await getUser(bot, userId);

      if (!user) return "Especifica el usuario correctamente";

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
        title: `Avatar pedido por ${interaction.user.username}#${interaction.user.discriminator}`,
        description: `[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`,
        image: { url: avatar },
      };
    }
  },
};
