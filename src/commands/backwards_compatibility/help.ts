import type { Command } from "../../types/command.ts";
import type {
  DiscordenoUser,
  Embed,
  SelectMenuComponent,
} from "../../../deps.ts";
import {
  cache,
  DiscordColors,
  Division,
  DivisionEmoji,
} from "../../utils/mod.ts";
import {
  avatarURL,
  MessageComponentTypes,
  sendMessage,
} from "../../../deps.ts";

export default <Command<false>> {
  options: {
    guildOnly: true,
    adminOnly: false,
    information: {
      descr: "📕 Ayuda del bot...",
      short: "📕 Ayuda del bot",
    },
  },
  division: Division.INFO,
  data: {
    name: "help",
  },
  async execute(bot, message, { prefix }) {
    const menu: SelectMenuComponent = {
      type: MessageComponentTypes.SelectMenu,
      customId: "menu",
      placeholder: "Nada seleccionado 📕📗📘",
      options: Array.from(Object.entries(Division))
        .filter(([k]) =>
          DivisionEmoji[
            `:category_${k.toLowerCase()}:` as keyof typeof DivisionEmoji
          ]
        )
        .map(([k, _v]) => {
          const emoji = DivisionEmoji[
            `:category_${k.toLowerCase()}:` as keyof typeof DivisionEmoji
          ];

          return {
            label: k.toString().toLowerCase(),
            value: k.toString(),
            emoji: {
              name: (/((?!a)\w\D\S)+/g).exec(emoji)?.[0],
              id: (/\d{18}/g).exec(emoji)?.[0],
              animated: !((/(a)/g).exec(emoji)?.[0]),
            },
            default: false,
          };
        }),
    };
    const me = <DiscordenoUser> bot.cache.users.get(bot.id);
    const author = <DiscordenoUser | undefined> bot.cache.users.get(
      message.authorId,
    );

    if (!author) return;

    const embed: Embed = {
      color: DiscordColors.Blurple,
      author: {
        name: author.username,
        iconUrl: avatarURL(
          bot,
          author.id,
          author.discriminator,
          {
            avatar: author.avatar,
            size: 512,
          },
        ),
      },
      thumbnail: {
        url: avatarURL(bot, me.id, me.discriminator, {
          avatar: me.avatar,
          size: 512,
        }),
      },
      description: `Mi prefix es: ${prefix}\n${
        cache.slashCommands.size + cache.commands.size
      } comandos`,
      footer: {
        text: `${author.id} <> Required [] Optional`,
        iconUrl: avatarURL(
          bot,
          author.id,
          author.discriminator,
          {
            avatar: author.avatar,
            size: 512,
          },
        ),
      },
    };
    await sendMessage(bot, message.channelId, {
      embeds: [embed],
      components: [{
        type: MessageComponentTypes.ActionRow,
        components: [menu],
      }],
    });
    return;
  },
};
