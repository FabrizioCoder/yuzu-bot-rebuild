import type { Command } from "../../types/command.ts";
import type { Embed, SelectMenuComponent } from "discordeno";
import { cache, Category, CategoryEmoji, DiscordColors } from "utils";
import { avatarURL, getUser, MessageComponentTypes, sendMessage } from "discordeno";

export default <Command<false>> {
  options: {
    isGuildOnly: true,
    isAdminOnly: false,
    information: {
      descr: "📕 Ayuda del bot...",
      short: "📕 Ayuda del bot",
    },
  },
  category: Category.Info,
  data: {
    name: "help",
  },
  using: ["user"],
  async execute({ bot, message, args, structs: { user } }) {
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
    const me = bot.users.get(bot.id) ?? await getUser(bot, bot.id);

    if (!user || !me) return;

    const embed: Embed = {
      color: DiscordColors.Blurple,
      author: {
        name: user.username,
        iconUrl: avatarURL(bot, user.id, user.discriminator, {
          avatar: user.avatar,
          size: 512,
        }),
      },
      thumbnail: {
        url: avatarURL(bot, me.id, me.discriminator, {
          avatar: me.avatar,
          size: 512,
        }),
      },
      description: `Mi prefix es: ${args.prefix}\n${cache.slashCommands.size + cache.commands.size} comandos`,
      footer: {
        text: `${user.id} <> Required [] Optional`,
        iconUrl: avatarURL(bot, user.id, user.discriminator, {
          avatar: user.avatar,
          size: 512,
        }),
      },
    };

    await sendMessage(bot, message.channelId, {
      embeds: [embed],
      components: [
        {
          type: MessageComponentTypes.ActionRow,
          components: [menu],
        },
      ],
    });
    return;
  },
};
