import type { Command } from "../../types/command.ts";
import type { DiscordenoUser, Embed } from "../../../deps.ts";
import { DiscordColors, Division } from "../../utils/mod.ts";
import { ApplicationCommandOptionTypes, avatarURL } from "../../../deps.ts";

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
  division: Division.UTIL,
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
      const userId = BigInt(option.value as string ?? interaction.user.id);
      const user = <DiscordenoUser | undefined> bot.cache.users.get(userId);

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
        title:
          `Avatar pedido por ${interaction.user.username}#${interaction.user.discriminator}`,
        description:
          `[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`,
        image: { url: avatar },
      };
    }
  },
};