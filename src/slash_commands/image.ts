import type { Command } from "../types/command.ts";

import type { ButtonComponent, DiscordenoMessage, Embed } from "../../deps.ts";

import {
  ApplicationCommandOptionTypes,
  avatarURL,
  ButtonStyles,
  deleteMessage,
  images,
  InteractionResponseTypes,
  sendInteractionResponse,
  sendMessage,
} from "../../deps.ts";

import {
  Division,
  Milliseconds,
  needButton,
  needMessage,
  randomHex,
} from "../utils/mod.ts";

// enums
enum ButtonEmojis {
  Back = "⏪",
  Next = "⏩",
  Page = "🔢",
  Xsign = "✖️",
}

// it makes sense ig
const buttons: [
  ButtonComponent,
  ButtonComponent,
  ButtonComponent,
  ButtonComponent,
] = [
  {
    type: 2, // all buttons have type 2
    label: ButtonEmojis.Back,
    customId: "back",
    style: ButtonStyles.Primary,
  },
  {
    type: 2,
    label: ButtonEmojis.Next,
    customId: "next",
    style: ButtonStyles.Primary,
  },
  {
    type: 2,
    label: ButtonEmojis.Page,
    customId: "page",
    style: ButtonStyles.Primary,
  },
  {
    type: 2,
    label: "delete",
    customId: ButtonEmojis.Xsign,
    style: ButtonStyles.Danger,
  },
];

export default <Command> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Busca imágenes en internet",
      short: "Busca imágenes",
      usage: "<Search>",
    },
  },
  division: Division.INFO,
  data: {
    name: "image",
    description: "Busca imágenes en internet",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        required: true,
        name: "search",
        description: "Búsqueda",
      },
    ],
  },
  async execute(bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return "Por favor escribe un texto";
    }

    if (!interaction.guildId || !interaction.channelId) return;

    const channel = await bot.cache.channels.get(interaction.channelId);

    // get an nsfw output if the currentChannel is nsfw
    const results = await images.search(
      option.value as string,
      channel?.nsfw ? images.SafetyLevels.STRICT : images.SafetyLevels.OFF,
    );

    const embed: Embed = {
      color: randomHex(),
      image: {
        url: results[0].image,
        height: results[0].height,
        width: results[0].width,
      },
      fields: [
        {
          name: "Búsqueda segura",
          value: channel?.nsfw ? "No" : "Sí",
        },
      ],
      author: {
        name: `${interaction.user.username}#${interaction.user.discriminator}`,
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
      footer: {
        text: `Results for ${option.value}`,
      },
    };

    const interactionId = interaction.id;
    const token = interaction.token;

    // this should work even if sendInteractionResponse() returns Promise<any>
    const message = <
      | DiscordenoMessage
      | undefined
    > await sendInteractionResponse(
      bot,
      interactionId,
      token,
      {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource,
        data: {
          embeds: [embed],
          components: [{ type: 1, components: buttons }],
        },
      },
    );

    // stuff to help the button collector
    const member = interaction?.member;

    if (!member || !message) return;

    let index = 0;

    while (index < results.length) {
      const button = await needButton(member.id, message.id, {
        duration: Milliseconds.MINUTE * 5,
        amount: 1,
      });

      switch (button.customId) {
        case "back":
          if (index > 0) index--;
          break;

        case "next":
          if (index < results.length) index++;
          break;

        case "page": {
          await sendMessage(
            bot,
            interaction.channelId!,
            "Ingresa un número desde 0 hasta " + results.length,
          );

          const response = await needMessage(member.id, interaction.channelId!);
          const newIndex = parseInt(response.content);

          if (!isNaN(newIndex)) {
            index = newIndex;
          }
          break;
        }

        case "delete":
          await deleteMessage(bot, interaction.channelId!, message.id);
          await sendInteractionResponse(
            bot,
            interaction.id,
            interaction.token,
            {
              type: InteractionResponseTypes.ChannelMessageWithSource,
              private: true,
              data: { content: "OK!" },
            },
          );
          return;

        default:
          break;
      }

      const currentImage = results[index];

      if (!currentImage || !currentImage.image) continue;

      const copy = Object.assign(Object.create(embed) as Embed, {
        image: {
          url: currentImage.image,
        },
        footer: {
          text: `Pag: ${index}/${results.length}`,
        },
      });

      // wtf it is so fucking fast
      await sendInteractionResponse(
        bot,
        button.interaction.id,
        button.interaction.token,
        {
          type: InteractionResponseTypes.UpdateMessage,
          data: { embeds: [copy] },
        },
      );
    }
  },
};
