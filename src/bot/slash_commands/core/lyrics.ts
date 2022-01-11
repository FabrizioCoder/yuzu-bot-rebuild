/* TODO: check for long song lyrics */

import { createCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";
import { default as f } from "axiod";

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
    descr: "Busca letras de canciones",
    short: "Busca letras de canciones",
    usage: "[@Mención]",
  },
  category: Category.Util,
  async execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    const { data } = await f.get<Song>(`https://some-random-api.ml/lyrics/?title=${option.value as string}`);

    if (!data || "error" in data) {
      return "No pude encontrar esa canción";
    }

    if (data.lyrics.length > 2048) {
      return "La canción excede el límite de caracteres";
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
