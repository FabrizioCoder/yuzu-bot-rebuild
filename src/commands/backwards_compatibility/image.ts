import type { Command } from "../../types/command.ts";
import type { ButtonComponent, Embed } from "../../../deps.ts";

import {
  avatarURL,
  ButtonStyles,
  deleteMessage,
  getChannel,
  getUser,
  InteractionResponseTypes,
  sendInteractionResponse,
  sendMessage,
} from "../../../deps.ts";

import { Category, Milliseconds, needButton, needMessage, randomHex } from "../../utils/mod.ts";

import { SafetyLevels, search } from "https://deno.land/x/ddgimages@v1.1.1/mod.ts";

// enums
enum ButtonEmojis {
  Back = "⏪",
  Next = "⏩",
  Page = "🔢",
  Xsign = "✖️",
}

// it makes sense ig
const buttons: [ButtonComponent, ButtonComponent, ButtonComponent, ButtonComponent] = [
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
    label: ButtonEmojis.Xsign,
    customId: "delete",
    style: ButtonStyles.Danger,
  },
];

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Busca imágenes en internet",
      short: "Busca imágenes",
      usage: "<Search>",
    },
  },
  category: Category.Util,
  data: {
    name: "image",
  },
  async execute(bot, message, { args }) {
    const option = args.join(" ");

    if (!option) return "Por favor escribe un texto";

    const channel = bot.channels.get(message.channelId) ?? await getChannel(bot, message.channelId);
    const author = bot.users.get(message.authorId) ?? await getUser(bot, message.authorId);

    if (!author) return;

    // get an nsfw output if the currentChannel is nsfw
    const results = await search(option, channel?.nsfw ? SafetyLevels.STRICT : SafetyLevels.OFF);
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
        iconUrl: avatarURL(bot, author.id, author.discriminator, {
          avatar: author.avatar,
          size: 512,
        }),
      },
      footer: { text: `Results for ${option}` },
    };

    // this should work even if sendInteractionResponse() returns Promise<any>
    const msg = await sendMessage(bot, message.channelId, {
      embeds: [embed],
      components: [{ type: 1, components: buttons }],
    });

    // stuff to help the button collector
    if (!msg) return;

    // the current page index
    let index = 0;

    // listen to buttons forever
    do {
      try {
        const button = await needButton(message.authorId, msg.id, {
          duration: Milliseconds.Minute * 5,
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
            await sendInteractionResponse(bot, button.interaction.id, button.interaction.token, {
              type: InteractionResponseTypes.DeferredUpdateMessage,
            });

            const tempMessage = await sendMessage(bot, message.channelId, {
              content: `Envía un número desde 0 hasta ${limit}`,
            });

            const response = await needMessage(message.authorId, message.channelId);

            if (tempMessage) {
              await deleteMessage(bot, message.channelId, tempMessage.id);
            }

            const newIndex = parseInt(response.content);

            // if the page to go doesn't exists
            if (!(newIndex in results) || newIndex > limit || newIndex < 0) {
              // TODO: this is a little bit tough to read
              // NOTE: this will not stop the command in any case
              await sendMessage(bot, message.channelId, "El número no existe en los resultados");
              continue;
            }
            if (!isNaN(newIndex)) {
              index = newIndex;
            }
            break;
          }

          case "delete": {
            const toDelete = button.interaction.message?.id;

            if (toDelete) {
              await deleteMessage(bot, message.channelId, toDelete);
            }

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
            iconUrl: avatarURL(bot, author.id, author.discriminator, {
              avatar: author.avatar,
              size: 512,
            }),
          },
        });

        // disable buttons to prevent the user to throw an unexpected result
        const backButtonIndex = buttons.findIndex((b) => b.customId === "back");
        const nextButtonIndex = buttons.findIndex((b) => b.customId === "next");

        index <= 0 ? (buttons[backButtonIndex].disabled = true) : (buttons[backButtonIndex].disabled = false);

        index >= limit ? (buttons[nextButtonIndex].disabled = true) : (buttons[nextButtonIndex].disabled = false);

        // edit the message the component is attached to
        await sendInteractionResponse(bot, button.interaction.id, button.interaction.token, {
          type: InteractionResponseTypes.UpdateMessage,
          data: {
            embeds: [copy],
            components: [{ type: 1, components: buttons }], // edited buttons
          },
        });
      } catch (_) {
        break;
      }
    } while (true);
  },
};
