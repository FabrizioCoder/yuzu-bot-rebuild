/* TODO: check for long song lyrics */

import { createCommand, createMessageCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

interface Song {
  lyrics: string;
  author: string;
  title: string;
  thumbnail: { genius: string };
  links: { genius: string };
}

interface Song {
  error: string;
}

createCommand({
  meta: {
    descr: "commands:lyrics:DESCRIPTION",
    usage: "commands:lyrics:USAGE",
  },
  category: Category.Util,
  async execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    const data: Song | undefined = await fetch(`https://some-random-api.ml/lyrics/?title=${option.value}`).then((a) =>
      a.json()
    );

    if (!data) {
      return "commands:lyrics:ON_ERROR";
    }

    if (data.lyrics.length > 2048) {
      return "commands:lyrics:ON_EMBED_LIMIT_EXCEEDED";
    }

    const { embed } = new MessageEmbed()
      .color(randomHex())
      .title(data.title)
      .author(data.author, data.thumbnail.genius)
      .footer(data.lyrics);

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("lyrics")
    .setDescription("Search for song lyrics")
    .addStringOption((o) => o.setName("query").setDescription("Search query for lyrics").setRequired(true))
    .toJSON(),
});

createMessageCommand({
  names: ["lyrics", "song"],
  meta: {
    descr: "commands:lyrics:DESCRIPTION",
    usage: "commands:lyrics:USAGE",
  },
  category: Category.Util,
  async execute({ args: { args } }) {
    const option = args.join(" ");

    if (!option) return;

    const data: Song | undefined = await fetch(`https://some-random-api.ml/lyrics/?title=${option}`).then((a) =>
      a.json()
    );

    if (!data) {
      return "commands:lyrics:ON_ERROR";
    }

    if (data.lyrics.length > 2048) {
      return "commands:lyrics:ON_EMBED_LIMIT_EXCEEDED";
    }

    const { embed } = new MessageEmbed()
      .color(randomHex())
      .title(data.title)
      .author(data.author, data.thumbnail.genius)
      .footer(data.lyrics);

    return embed;
  },
});
