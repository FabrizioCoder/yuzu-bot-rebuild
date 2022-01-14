/* TODO: check for long song lyrics */

import { createMessageCommand, MessageEmbed } from "oasis";
import { Category, randomHex } from "utils";

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
  names: ["lyrics", "song"],
  meta: {
    descr: "Busca letras de canciones",
    short: "Busca letras de canciones",
    usage: "[@Mención]",
  },
  category: Category.Util,
  async execute({ args: { args } }) {
    const option = args.join(" ");

    if (!option) return;

    const data: Song | undefined = await fetch(`https://some-random-api.ml/lyrics/?title=${option}`).then((a) =>
      a.json()
    );

    if (!data) {
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
