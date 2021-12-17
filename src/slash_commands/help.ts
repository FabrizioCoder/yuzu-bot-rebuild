import type { Command } from "../types/command.ts";
import type { Embed, SelectMenuComponent } from "../../deps.ts";

import { cache, DiscordColors, Division, DivisionEmoji } from "../utils/mod.ts";

import {
  avatarURL,
  getUser,
  InteractionResponseTypes,
  MessageComponentTypes,
  sendInteractionResponse,
} from "../../deps.ts";

export default <Command> {
  options: {
    guildOnly: true,
    adminOnly: false,
    information: {
      descr: "\\📕 Ayuda del bot...",
      short: "\\📕 Ayuda del bot",
      usage: "...",
    },
  },
  division: Division.INFO,
  data: {
    name: "help",
    description: "📕 Ayuda del bot...",
  },
  async execute(bot, interaction) {
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
    const me = bot.users.get(bot.id) ?? await getUser(bot, bot.id);

    if (!me) return;

    const embed: Embed = {
      color: DiscordColors.Blurple,
      author: {
        name: interaction.user.username,
        iconUrl: avatarURL(
          bot,
          interaction.user.id,
          interaction.user.discriminator,
          {
            avatar: interaction.user.avatar,
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
      description: `Mi prefix es: !\n${cache.slashCommands.size + cache.commands.size} comandos`,
      footer: {
        text: `${interaction.user.id} <> Required [] Optional`,
        iconUrl: avatarURL(
          bot,
          interaction.user.id,
          interaction.user.discriminator,
          {
            avatar: interaction.user.avatar,
            size: 512,
          },
        ),
      },
    };
    await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      data: {
        embeds: [embed],
        components: [{
          type: MessageComponentTypes.ActionRow,
          components: [menu],
        }],
      },
    });
    return;
  },
};
