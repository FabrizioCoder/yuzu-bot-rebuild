import { createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { ApplicationCommandOptionTypes, avatarURL, getUser } from "discordeno";
import { Category, DiscordColors } from "utils";

export default createCommand({
  meta: {
    descr: "Busca el avatar de un usuario",
    short: "Busca avatares",
    usage: "[@Mención]",
  },
  category: Category.Info,
  async execute({ bot, interaction }) {
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

    const { embed } = new MessageEmbed()
      .author(`Dueño: ${user.username}#${user.discriminator}`, avatar)
      .color(DiscordColors.Blurple)
      .title(`Avatar pedido por ${interaction.user.username}#${interaction.user.discriminator}`)
      .description(`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`)
      .image(avatar);

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("avatar")
    .setDescription("Busca el avatar de un usuario")
    .addUserOption((o) => o.setName("target").setDescription("The user").setRequired(true))
    .toJSON(),
});
