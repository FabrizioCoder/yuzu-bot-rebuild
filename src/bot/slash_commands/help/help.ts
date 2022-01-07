import type { Context } from "oasis";
import { Command, MessageEmbed } from "oasis";
import { cache, Category, CategoryEmoji, DiscordColors } from "utils";
import {
  avatarURL,
  InteractionResponseTypes,
  MessageComponentTypes,
  sendInteractionResponse,
  type SelectMenuComponent,
} from "discordeno";

@Command({
  name: "help",
  description: "📕 Ayuda del bot...",
  category: Category.Info,
  meta: {
    descr: "\\📕 Ayuda del bot...",
    short: "\\📕 Ayuda del bot",
    usage: "...",
  },
})
export default class {
  static async execute({ bot, interaction }: Context) {
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

    const avatar = avatarURL(bot, interaction.user.id, interaction.user.discriminator, {
      avatar: interaction.user.avatar,
    });

    const embed = MessageEmbed
      .new()
      .color(DiscordColors.Blurple)
      .author(interaction.user.username, avatar)
      .thumbnail(avatar)
      .description(`${cache.slashCommands.size + cache.commands.size} comandos`)
      .footer(`${interaction.user.id} <> Required [] Optional`, avatar)
      .end();

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
  }
}
