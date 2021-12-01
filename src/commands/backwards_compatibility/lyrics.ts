/* TODO: check for long song lyrics */

import type { Command } from "../../types/command.ts";
import type { Embed } from "../../../deps.ts";
import { Division, randomHex } from "../../utils/mod.ts";

import axiod from "https://deno.land/x/axiod@0.23.1/mod.ts";

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

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Busca letras de canciones",
      short: "Busca letras de canciones",
      usage: "[@Mención]",
    },
  },
  division: Division.UTIL,
  data: {
    name: "lyrics",
  },
  async execute(_bot, _message, { args }) {
    const option = args.join(" ");

    if (option) {
      const { data } = await axiod.get<Song>(
        `https://some-random-api.ml/lyrics/?title=${option}`,
      );

      if (!data || data.error) return "No pude encontrar esa canción";

      const embed = <Embed & { fields: [] }> {
        title: data.title,
        color: randomHex(),
        author: {
          iconUrl: data.thumbnail.genius,
          name: data.author,
        },
        fields: [],
      };

      if (data.lyrics.length > 2048) {
        return "La canción excede el límite de caracteres";
      }

      embed.footer = { text: data.lyrics };

      return embed;
    }
  },
};