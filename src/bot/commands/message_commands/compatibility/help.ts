import type { SelectMenuComponent } from "discordeno";
import { cache, createMessageCommand, MessageEmbed } from "oasis";
import { Category, CategoryEmoji, DiscordColors } from "utils";
import { avatarURL, getUser, MessageComponentTypes, sendMessage } from "discordeno";

createMessageCommand({
  names: ["help"],
  isGuildOnly: true,
  meta: {
    descr: "📕 Ayuda del bot...",
    short: "📕 Ayuda del bot",
  },
  category: Category.Info,
  async execute({ bot, message, args }) {
    const author = bot.users.get(message.authorId) ?? (await getUser(bot, message.authorId));

    const menu: SelectMenuComponent = {
      type: MessageComponentTypes.SelectMenu,
      customId: "menu",
      placeholder: "Nada seleccionado 📕📗📘",
      options: Array.from(Object.entries(Category))
        .filter(([k]) => k !== "Admin")
        .filter(([k]) => CategoryEmoji[`:category_${k.toLowerCase()}:` as keyof typeof CategoryEmoji])
        .map(([k, _v]) => {
          const emoji = CategoryEmoji[`:category_${k.toLowerCase()}:` as keyof typeof CategoryEmoji];

          return {
            label: k.toString().toLowerCase(),
            value: k.toString(),
            emoji: {
              name: /((?!a)\w\D\S)+/g.exec(emoji)?.[0],
              id: /\d{18}/g.exec(emoji)?.[0],
              animated: !/(a)/g.exec(emoji)?.[0],
            },
            default: false,
          };
        }),
    };

    if (!author) {
      return;
    }

    const avatar = avatarURL(bot, author.id, author.discriminator, {
      avatar: author.avatar,
      size: 512,
    });

    const { embed } = new MessageEmbed()
      .color(DiscordColors.Blurple)
      .author(author.username, avatar)
      .thumbnail(avatar)
      .description(`Mi prefix es: ${args.prefix}\n${cache.slashCommands.size + cache.commands.size} comandos`)
      .footer(`${author.id} <> Required [] Optional`, avatar);

    await sendMessage(bot, message.channelId, {
      embeds: [embed],
      components: [
        {
          type: MessageComponentTypes.ActionRow,
          components: [menu],
        },
      ],
    });
  },
});
