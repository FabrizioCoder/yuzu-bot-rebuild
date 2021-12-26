/* TODO: check for long song lyrics */
import type { Command } from "../../types/command.ts";
import type { Embed } from "discordeno";
import { Category, randomHex } from "utils";
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
  category: Category.Util,
  data: {
    name: "lyrics",
  },
  async execute(_bot, _message, { args }) {
    const option = args.join(" ");

    if (option) {
      const { data } = await f.get<Song>(`https://some-random-api.ml/lyrics/?title=${option}`);

      if (!data || "error" in data) return "No pude encontrar esa canción";

      const embed: Embed = {
        title: data.title,
        color: randomHex(),
        author: {
          iconUrl: data.thumbnail.genius,
          name: data.author,
        },
      };

      if (data.lyrics.length > 2048) {
        return "La canción excede el límite de caracteres";
      }

      embed.footer = { text: data.lyrics };

      return embed;
    }
  },
};
