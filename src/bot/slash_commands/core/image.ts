import type { ButtonComponent } from "discordeno";
import { type Context, Command, MessageEmbed, Option } from "oasis";
import { Category, Milliseconds, needButton, needMessage, randomHex } from "utils";
import {
  ApplicationCommandOptionTypes,
  avatarURL,
  ButtonStyles,
  deleteMessage,
  getChannel,
  InteractionResponseTypes,
  sendInteractionResponse,
  sendMessage,
} from "discordeno";
import { SafetyLevels, search } from "images";

// enums
enum ButtonEmojis {
  Back = "⏪",
  Next = "⏩",
  Page = "🔢",
  Random = "🔀",
  Xsign = "✖️",
}

// it makes sense ig
const buttons: [ButtonComponent, ButtonComponent, ButtonComponent, ButtonComponent, ButtonComponent] = [
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

@Command({
  name: "image",
  description: "Busca imágenes en internet",
  meta: {
    descr: "Busca imágenes en internet",
    short: "Busca imágenes",
    usage: "<Search>",
  },
  category: Category.Util,
})
@Option({
  type: ApplicationCommandOptionTypes.String,
  required: true,
  name: "search",
  description: "Búsqueda",
})
export default class {
  static async execute({ bot, interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return "Por favor escribe un texto";
    }

    if (!interaction.channelId) {
      return;
    }

    const channel = bot.channels.get(interaction.channelId) ?? await getChannel(bot, interaction.channelId);

    if (!channel) {
      return;
    }

    // get an nsfw output if the currentChannel is nsfw
    const results = await search(option.value as string, channel.nsfw ? SafetyLevels.STRICT : SafetyLevels.OFF);
    const limit = results.length - 1;

    // // this is the base embed to send
    const embed = MessageEmbed
      .new()
      .color(randomHex())
      .image(results[0].image)
      .field("Búsqueda segura", channel.nsfw ? "No" : "Sí")
      .author(
        results[0].source,
        avatarURL(bot, interaction.user.id, interaction.user.discriminator, { avatar: interaction.user.avatar })
      )
      .footer(`Results for ${option.value}`);

    const message = await sendInteractionResponse(bot, interaction.id, interaction.token, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      data: { embeds: [embed.end()], components: [{ type: 1, components: buttons }] },
    });

    // stuff to help the button collector
    if (!message) return;

    // the current page index
    let index = 0;

    // listen to buttons forever
    do {
      try {
        const button = await needButton(interaction.user.id, message.id, {
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

            const tempMessage = await sendMessage(bot, channel.id, {
              content: `Envía un número desde 0 hasta ${limit}`,
            });

            const response = await needMessage(interaction.user.id, channel.id);

            if (tempMessage) {
              await deleteMessage(bot, channel.id, tempMessage.id);
            }

            const newIndex = parseInt(response.content);

            // if the page to go doesn't exists
            if (!(newIndex in results) || newIndex > limit || newIndex < 0) {
              // TODO: this is a little bit tough to read
              // NOTE: this will not stop the command in any case
              await sendInteractionResponse(bot, interaction.id, interaction.token, {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                private: true,
                data: { content: "El número no existe en los resultados" },
              });

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
              await deleteMessage(bot, channel.id, toDelete);
            }

            await sendInteractionResponse(bot, interaction.id, interaction.token, {
              type: InteractionResponseTypes.ChannelMessageWithSource,
              private: true,
              data: { content: "OK!" },
            });

            continue;
          }

          default:
            break;
        }
        const result = results[index];

        embed.image(result.image);
        embed.footer(`📜: ${index}/${limit}`);
        embed.author(result.source);

        // disable buttons to prevent the user to throw an unexpected result
        const backButtonIndex = buttons.findIndex((b) => b.customId === "back");
        const nextButtonIndex = buttons.findIndex((b) => b.customId === "next");

        index <= 0 ? (buttons[backButtonIndex].disabled = true) : (buttons[backButtonIndex].disabled = false);

        index >= limit ? (buttons[nextButtonIndex].disabled = true) : (buttons[nextButtonIndex].disabled = false);

        // edit the message the component is attached to
        await sendInteractionResponse(bot, button.interaction.id, button.interaction.token, {
          type: InteractionResponseTypes.UpdateMessage,
          data: { embeds: [embed.end()], components: [{ type: 1, components: buttons }] },
        });
      } catch {
        break;
      }
    } while (true);
  }
}
