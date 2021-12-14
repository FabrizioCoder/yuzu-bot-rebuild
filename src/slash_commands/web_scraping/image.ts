import type { Command } from "../../types/command.ts";
import type { ButtonComponent, Embed } from "../../../deps.ts";

import {
  ApplicationCommandOptionTypes,
  avatarURL,
  ButtonStyles,
  deleteMessage,
  InteractionResponseTypes,
  sendInteractionResponse,
  sendMessage,
} from "../../../deps.ts";

import {
  Division,
  Milliseconds,
  needButton,
  needMessage,
  randomHex,
} from "../../utils/mod.ts";

import {
  SafetyLevels,
  search,
} from "https://deno.land/x/ddgimages@v1.1.1/mod.ts";

// enums
enum ButtonEmojis {
  Back = "⏪",
  Next = "⏩",
  Page = "🔢",
  Random = "🔀",
  Xsign = "✖️",
}

// it makes sense ig
const buttons: [
  ButtonComponent,
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
    disabled: true,
  },
  {
    type: 2,
    label: ButtonEmojis.Next,
    customId: "next",
    style: ButtonStyles.Primary,
    disabled: false,
  },
  {
    type: 2,
    label: ButtonEmojis.Page,
    customId: "page",
    style: ButtonStyles.Primary,
  },
  {
    type: 2,
    label: ButtonEmojis.Random,
    customId: "random",
    style: ButtonStyles.Primary,
  },
  {
    type: 2,
    label: ButtonEmojis.Xsign,
    customId: "delete",
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
  division: Division.UTIL,
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

    if (!interaction.channelId) return;

    const channel = bot.channels.get(interaction.channelId);

    // get an nsfw output if the currentChannel is nsfw
    const results = await search(
      option.value as string,
      channel?.nsfw ? SafetyLevels.STRICT : SafetyLevels.OFF,
    );
    const limit = results.length - 1;

    // this is the base embed to send
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
        name: results[0].source,
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
      footer: { text: `Results for ${option.value}` },
    };

    const message = await sendInteractionResponse(
      bot,
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource,
        data: {
          embeds: [embed],
          components: [{ type: 1, components: buttons }],
        },
      },
    );

    // stuff to help the button collector
    if (!message) return;

    // the current page index
    let index = 0;

    // listen to buttons forever
    do {
      try {
        const button = await needButton(interaction.user.id, message.id, {
          duration: Milliseconds.MINUTE * 5,
          amount: 1,
        });

        switch (button.customId) {
          case "back": {
            if (index > 0) index--;
            break;
          }

          case "next": {
            if (index < limit) index++;
            break;
          }

          case "page": {
            await sendInteractionResponse(
              bot,
              button.interaction.id,
              button.interaction.token,
              {
                type: InteractionResponseTypes.DeferredUpdateMessage,
              },
            );

            const tempMessage = await sendMessage(bot, interaction.channelId, {
              content: `Envía un número desde 0 hasta ${limit}`,
            });

            const response = await needMessage(
              interaction.user.id,
              interaction.channelId,
            );

            if (tempMessage) {
              await deleteMessage(bot, interaction.channelId, tempMessage.id);
            }

            const newIndex = parseInt(response.content);

            // if the page to go doesn't exists
            if (!(newIndex in results) || newIndex > limit || newIndex < 0) {
              // TODO: this is a little bit tough to read
              // NOTE: this will not stop the command in any case
              await sendInteractionResponse(
                bot,
                interaction.id,
                interaction.token,
                {
                  type: InteractionResponseTypes.ChannelMessageWithSource,
                  private: true,
                  data: { content: "El número no existe en los resultados" },
                },
              );

              continue;
            }
            if (!isNaN(newIndex)) {
              index = newIndex;
            }
            break;
          }

          case "random": {
            index = Math.floor(Math.random() * limit);
            break;
          }

          case "delete": {
            const toDelete = button?.interaction?.message?.id;

            if (toDelete) {
              await deleteMessage(bot, interaction.channelId, toDelete);
            }

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

            continue;
          }

          default:
            break;
        }
        const result = results[index];

        // create a copy of the embed rewritting the footer & image
        const copy = Object.assign(Object.create(embed) as Embed, {
          image: {
            url: result.image,
          },
          footer: {
            text: `📜: ${index}/${limit}`,
          },
          author: {
            name: result.source,
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
        });

        // disable buttons to prevent the user to throw an unexpected result
        const backButtonIndex = buttons.findIndex((b) => b.customId === "back");
        const nextButtonIndex = buttons.findIndex((b) => b.customId === "next");

        index <= 0
          ? buttons[backButtonIndex].disabled = true
          : buttons[backButtonIndex].disabled = false;

        index >= limit
          ? buttons[nextButtonIndex].disabled = true
          : buttons[nextButtonIndex].disabled = false;

        // edit the message the component is attached to
        await sendInteractionResponse(
          bot,
          button.interaction.id,
          button.interaction.token,
          {
            type: InteractionResponseTypes.UpdateMessage,
            data: {
              embeds: [copy],
              components: [{ type: 1, components: buttons }], // edited buttons
            },
          },
        );
      } catch (_) {
        break;
      }
    } while (true);
  },
};
