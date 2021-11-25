/* TODO: this code is not done yet */

import type { Command } from "../types/command.ts";

import type { ButtonComponent, DiscordenoMessage, Embed } from "../../deps.ts";

import {
  ApplicationCommandOptionTypes,
  ButtonStyles,
  images,
  InteractionResponseTypes,
  sendInteractionResponse,
} from "../../deps.ts";

import { Division, Milliseconds } from "../utils/mod.ts";

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

    // it makes sense ig
    const buttons: [
      ButtonComponent,
      ButtonComponent,
      ButtonComponent,
      ButtonComponent,
    ] = [
      {
        type: 2, // all buttons have type 2
        label: "Go back",
        customId: "back",
        style: ButtonStyles.Primary,
      },
      {
        type: 2,
        label: "Go next",
        customId: "next",
        style: ButtonStyles.Primary,
      },
      {
        type: 2,
        label: "Page",
        customId: "page",
        style: ButtonStyles.Primary,
      },
      {
        type: 2,
        label: "Delete",
        customId: "delete",
        style: ButtonStyles.Danger,
      },
    ];

    const embed: Embed = {
      title: "test",
      image: {
        url: results[0].image,
        height: results[0].height,
        width: results[0].width,
      },
    };

    // this should work even if sendInteractionResponse() returns Promise<any>
    const message = <
      | DiscordenoMessage
      | undefined
    > await sendInteractionResponse(
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
    const member = interaction?.member;

    if (!member || !message) return;
  },
};
