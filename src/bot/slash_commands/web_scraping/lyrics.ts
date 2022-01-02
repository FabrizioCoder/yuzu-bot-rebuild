/* TODO: check for long song lyrics */
import type { Command } from "../../types/command.ts";
import type { Embed } from "discordeno";
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

export default <Command> {
  options: {
    isGuildOnly: false,
    information: {
      descr: "Busca letras de canciones",
      short: "Busca letras de canciones",
      usage: "[@Mención]",
    },
  },
  category: Category.Util,
  data: {
    name: "lyrics",
    description: "Busca letras de canciones",
    options: [
      {
        type: ApplicationCommandOptionTypes.String,
        required: true,
        name: "search",
        description: "Lyrics",
      },
    ],
  },
  async execute(_bot, interaction) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) return;

    const { data } = await f.get<Song>(`https://some-random-api.ml/lyrics/?title=${option.value as string}`);

    if (!data || "error" in data) {
      return "No pude encontrar esa canción";
    }

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
  },
};
