import { createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { cache, Category, CategoryEmoji, DiscordColors } from "utils";
import {
  avatarURL,
  InteractionResponseTypes,
  MessageComponentTypes,
  sendInteractionResponse,
  type SelectMenuComponent,
} from "discordeno";

export default createCommand({
  meta: {
    descr: "\\📕 Ayuda del bot...",
    short: "\\📕 Ayuda del bot",
    usage: "...",
  },
  category: Category.Info,
  async execute({ bot, interaction }) {
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

    const { embed } = new MessageEmbed()
      .color(DiscordColors.Blurple)
      .author(interaction.user.username, avatar)
      .thumbnail(avatar)
      .description(`${cache.slashCommands.size + cache.commands.size} comandos`)
      .footer(`${interaction.user.id} <> Required [] Optional`, avatar);

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
  data: new ChatInputApplicationCommandBuilder()
    .setName("help")
    .setDescription("\\📕 Ayuda del bot...")
    .toJSON(),
});
