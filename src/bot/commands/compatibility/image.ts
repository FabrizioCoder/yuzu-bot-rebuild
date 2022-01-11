import type { ButtonComponent } from "discordeno";
import { createMessageCommand, needButton, needMessage, MessageEmbed, Milliseconds } from "oasis";
import { Category, randomHex } from "utils";
import {
  avatarURL,
  ButtonStyles,
  deleteMessage,
  editMessage,
  getChannel,
  getUser,
  InteractionResponseTypes,
  sendInteractionResponse,
  sendMessage,
} from "discordeno";
import { SafetyLevels, search } from "images";

// enums
const ButtonEmojis = <const>{
  Back: {
    id: "930546313890791444",
    name: "left",
    animated: false,
  },
  Next: {
    id: "930546356408418395",
    name: "right",
    animated: false,
  },
  Page: {
    id: "930558978721734797",
    name: "chat_bubble",
    animated: false,
  },
  Random: {
    id: "930559182241955850",
    name: "shuffle",
    animated: false,
  },
  Xsign: "✖️",
};

// NOTE: using a tuple because the max size of buttons is 5
// Do this outside of the func body
const buttons: [ButtonComponent, ButtonComponent, ButtonComponent, ButtonComponent, ButtonComponent] = [
  {
    type: 2, // all buttons have type 2
    label: "",
    emoji: ButtonEmojis.Back,
    customId: "back",
    style: ButtonStyles.Primary,
    disabled: true,
  },
  {
    type: 2,
    label: "",
    emoji: ButtonEmojis.Next,
    customId: "next",
    style: ButtonStyles.Primary,
    disabled: false,
  },
  {
    type: 2,
    label: "",
    emoji: ButtonEmojis.Page,
    customId: "page",
    style: ButtonStyles.Primary,
  },
  {
    type: 2,
    label: "",
    emoji: ButtonEmojis.Random,
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

createMessageCommand({
  name: "image",
  meta: {
    // help command ignore this
    descr: "Busca imágenes en internet",
    short: "Busca imágenes",
    usage: "<Search>",
  },
  category: Category.Util,
  async execute({ bot, message, args: { args } }) {
    const option = args[0];

    if (!option) {
      return "Por favor escribe un texto";
    }

    const channel = bot.channels.get(message.channelId) ?? (await getChannel(bot, message.channelId));

    if (!channel) {
      return;
    }

    const author = bot.users.get(message.authorId) ?? (await getUser(bot, message.authorId));

    // get an nsfw output if the currentChannel is nsfw
    const results = await search(option, channel.nsfw ? SafetyLevels.STRICT : SafetyLevels.OFF);
    const limit = results.length - 1;

    // this is the base embed to send
    const embed = new MessageEmbed()
      .color(randomHex())
      .image(results[0].image)
      .field("Búsqueda segura", channel.nsfw ? "No" : "Sí")
      .author(results[0].source, avatarURL(bot, author.id, author.discriminator, { avatar: author.avatar }))
      .footer(`Results for ${option}`);
    // do not end this ^ for now

    const sended = await sendMessage(bot, message.channelId, {
      embeds: [embed.embed],
      components: [{ type: 1, components: buttons }],
    });

    // stuff to help the button collector
    if (!sended) return;

    // the current page index
    const currentPageIndex = 0;

    // execute the 'loop'
    read(sended.id, sended.channelId, message.authorId, currentPageIndex, Milliseconds.Minute * 5);

    // do a recursive function instead of a while(true) loop
    // highly recommended
    function read(
      sendedMessageId: bigint,
      sendedMessageChannelId: bigint,
      sendedMessageAuthorId: bigint,
      acc: number,
      time: Milliseconds
    ) {
      // important: Button from the cache if the timer is gone just pass! #243
      needButton(sendedMessageAuthorId, sendedMessageId, {
        duration: time,
        amount: 1,
        filter: (_, user) => user?.id === message.authorId,
      })
        .then(async (button) => {
          switch (button.customId) {
            case "back": {
              if (acc > 0) acc--;
              break;
            }

            case "next": {
              if (acc < limit) acc++;
              break;
            }

            case "page": {
              await sendInteractionResponse(bot, button.interaction.id, button.interaction.token, {
                type: InteractionResponseTypes.DeferredUpdateMessage,
              });

              const tempMessage = await sendMessage(bot, sendedMessageChannelId, {
                content: `Envía un número desde 0 hasta ${limit}`,
              });

              const response = await needMessage(message.authorId, sendedMessageChannelId);

              if (tempMessage) {
                await deleteMessage(bot, sendedMessageChannelId, tempMessage.id);
              }

              const newIndex = parseInt(response.content);

              // if the page to go doesn't exists
              if (newIndex > limit || newIndex < 0) {
                // NOTE: this will not stop the command in any case
                await sendMessage(bot, sendedMessageChannelId, { content: "El número no existe en los resultados" });
                // repeat w/ new index? (not necessary)
                read(sendedMessageId, sendedMessageChannelId, sendedMessageAuthorId, acc, time);
              }
              if (!isNaN(newIndex) && newIndex in results) {
                acc = newIndex;
                const result = results[acc];

                embed.image(result.image);
                embed.footer(`📜: ${acc}/${limit}`);
                embed.author(result.source);

                // disable buttons to prevent the user to throw an unexpected result
                const backButtonIndex = buttons.findIndex((b) => b.customId === "back");
                const nextButtonIndex = buttons.findIndex((b) => b.customId === "next");

                acc <= 0 ? (buttons[backButtonIndex].disabled = true) : (buttons[backButtonIndex].disabled = false);
                acc >= limit ? (buttons[nextButtonIndex].disabled = true) : (buttons[nextButtonIndex].disabled = false);

                // edit the message the component is attached to
                await editMessage(bot, sendedMessageChannelId, sendedMessageId, {
                  embeds: [embed.embed],
                  components: [{ type: 1, components: buttons }],
                });
                read(sendedMessageId, sendedMessageChannelId, sendedMessageAuthorId, acc, time);
                return;
              }

              break;
            }

            case "random": {
              acc = Math.floor(Math.random() * limit);
              break;
            }

            case "delete": {
              const toDelete = button?.interaction?.message?.id;

              if (toDelete) {
                await deleteMessage(bot, sendedMessageChannelId, toDelete);
              }
              return;
            }

            default:
              break;
          }
          const result = results[acc];

          embed.image(result.image);
          embed.footer(`📜: ${acc}/${limit}`);
          embed.author(result.source);

          // disable buttons to prevent the user to throw an unexpected result
          const backButtonIndex = buttons.findIndex((b) => b.customId === "back");
          const nextButtonIndex = buttons.findIndex((b) => b.customId === "next");

          acc <= 0 ? (buttons[backButtonIndex].disabled = true) : (buttons[backButtonIndex].disabled = false);
          acc >= limit ? (buttons[nextButtonIndex].disabled = true) : (buttons[nextButtonIndex].disabled = false);

          // edit the message the component is attached to
          await sendInteractionResponse(bot, button.interaction.id, button.interaction.token, {
            type: InteractionResponseTypes.UpdateMessage,
            data: { embeds: [embed.embed], components: [{ type: 1, components: buttons }] },
          });
          read(sendedMessageId, sendedMessageChannelId, sendedMessageAuthorId, acc, time);
        })
        .catch(async () => {
          // remove buttons
          await editMessage(bot, sendedMessageChannelId, sendedMessageId, { components: [] });
          // do not repeat
          // pass
        });
    }
  },
});
