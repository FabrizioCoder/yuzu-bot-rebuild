/* TODO: check for long song lyrics */

import { type Context, Command, MessageEmbed } from "oasis";
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

@Command({
  name: "lyrics",
  description: "Busca letras de canciones",
  meta: {
    descr: "Busca letras de canciones",
    short: "Busca letras de canciones",
    usage: "[@Mención]",
  },
  category: Category.Util,
})
export default class {
  static async execute({ args: { args } }: Context<false>) {
    const option = args.join(" ");

    if (!option) return;

    const { data } = await f.get<Song>(`https://some-random-api.ml/lyrics/?title=${option}`);

    if (!data || "error" in data) {
      return "No pude encontrar esa canción";
    }

    if (data.lyrics.length > 2048) {
      return "La canción excede el límite de caracteres";
    }

    const embed = MessageEmbed
      .new()
      .color(randomHex())
      .title(data.title)
      .author(data.author, data.thumbnail.genius)
      .footer(data.lyrics)
      .end();

    return embed;
  }
}
