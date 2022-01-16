import { createCommand, createMessageCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { ApplicationCommandOptionTypes, avatarURL, getUser } from "discordeno";
import { Category, DiscordColors, translate } from "utils";

createCommand({
  meta: {
    descr: "commands:avatar:DESCRIPTION",
    usage: "[@Mention]",
  },
  category: Category.Info,
  translated: true,
  async execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.User) {
      return;
    }

    const userId = !option ? interaction.user.id : BigInt(option.value as string);
    const user = bot.users.get(userId) ?? (await getUser(bot, userId));

    if (!user) {
      return "commands:avatar:ON_MISSING_USER";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, {
      avatar: user.avatar,
      size: 2048,
    });

    const { embed } = new MessageEmbed()
      .author(`Owner: ${user.username}#${user.discriminator}`, avatar)
      .color(DiscordColors.Blurple)
      .title(
        await translate(bot, `commands:avatar:EMBED_TITLE`, interaction.guildId, {
          mention: `${interaction.user.username}#${interaction.user.discriminator}`,
        })
      )
      .description(`[Referencia](https://www.google.com/searchbyimage?image_url=${avatar})\n[Avatar URL](${avatar})`)
      .image(avatar);

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("avatar")
    .setDescription("Search for a user's avatar")
    .addUserOption((o) => o.setName("target").setDescription("The user").setRequired(true))
    .toJSON(),
});

createMessageCommand({
  names: ["avatar", "pfp", "avy", "profilepicture"],
  meta: {
    descr: "commands:avatar:DESCRIPTION",
    usage: "[@Mención]",
  },
  category: Category.Info,
  translated: true,
  async execute({ bot, message, args: { args } }) {
    const givenId = /\d{18}/g.exec(args.join(" "))?.[0];

    const userId = BigInt(givenId ?? message.authorId.toString());
    const user = bot.users.get(userId) ?? (await getUser(bot, userId));

    if (!user) {
      return "commands:avatar:ON_MISSING_USER";
    }

    const avatar = avatarURL(bot, user.id, user.discriminator, { avatar: user.avatar, size: 2048 });

    const { embed } = new MessageEmbed()
      .author(`Owner: ${user.username}#${user.discriminator}`, avatar)
      .color(DiscordColors.Blurple)
      .title(await translate(bot, `commands:avatar:EMBED_TITLE`, message.guildId, { mention: message.tag }))
      .description(await translate(bot, `commands:avatar:EMBED_DESCRIPTION`, message.guildId, { avatar }))
      .image(avatar);

    return embed;
  },
});
