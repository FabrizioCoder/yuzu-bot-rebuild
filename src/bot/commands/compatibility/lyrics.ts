/* TODO: check for long song lyrics */

import { createMessageCommand, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";
import { default as f } from "axiod";

/* data for the api */
interface Song {
  lyrics: string;
  author: string;
  title: string;
  thumbnail: { genius: string };
  links: { genius: string };
}

/* overload */
interface Song {
  error: string;
}

createMessageCommand({
  name: "lyrics",
  meta: {
    descr: "Busca letras de canciones",
    short: "Busca letras de canciones",
    usage: "[@Mención]",
  },
  category: Category.Util,
  async execute({ args: { args } }) {
    const option = args.join(" ");

    if (!option) return;

    const { data } = await f.get<Song>(`https://some-random-api.ml/lyrics/?title=${option}`);

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
});
