// deno-lint-ignore-file camelcase

import type { Command } from "../../types/command.ts";
import type { DiscordenoUser, Embed } from "../../../deps.ts";
import { Division, randomHex } from "../../utils/mod.ts";
import { avatarURL } from "../../../deps.ts";
import axiod from "https://deno.land/x/axiod@0.23.1/mod.ts";

// TYPING

interface ApiResource {
  name: string;
  url: string;
}

interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  is_default: boolean;
  order: number;
  weight: number;
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  types: PokemonType[];
}

interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: ApiResource;
}

interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  front_female?: string;
  front_shinyFemale?: string;

  back_default: string;
  back_shiny: string;
  back_female?: string;
  backShiny_female?: string;
}

interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: ApiResource;
}

interface PokemonType {
  slot: number;
  type: ApiResource;
}

interface PokemonTarget {
  id: number;
  specie: string;
  shiny: boolean;
  mega: boolean;
}

// UTILITY

async function getPokemonFromApi(
  pokemon: string | number,
): Promise<Pokemon | undefined> {
  const pokeAPI = "https://pokeapi.co/api/v2";

  try {
    const { data } = await axiod.get<Pokemon>(`${pokeAPI}/pokemon/${pokemon}`);

    return data;
  } catch (_) {
    return undefined;
  }
}

function parseMessageToPokemon(message: string): PokemonTarget {
  const base = {
    shiny: false,
    mega: false,
  };

  if (!isNaN(parseInt(message))) {
    return <PokemonTarget> Object.assign(base, {
      id: parseInt(message),
      specie: "",
    });
  } else {
    return <PokemonTarget> Object.assign(base, {
      id: 0,
      specie: message.toLowerCase(),
    });
  }
}

function parsePokemonWeight(weight: number): string {
  let strWeight = weight.toString(); // var prevent shadowing
  const len = strWeight.length;

  if (len === 1) strWeight = `0.${strWeight}`;
  else if (len >= 2) strWeight = strWeight.slice(0, len - 1);
  return strWeight;
}

// Command...

export default <Command<false>> {
  options: {
    guildOnly: false,
    adminOnly: false,
    information: {
      descr: "Comando para buscar un pokémon por su nombre o id",
      short: "Busca pokemones.",
      usage: "<Nombre o id>",
    },
  },
  division: Division.FUN,
  data: {
    name: "dex",
  },
  async execute(_bot, _message, { args }) {
    const option = args.join(" ");

    if (!option) {
      return "Debes ingresar más información del pokémon para buscarlo.";
    }

    const target = parseMessageToPokemon(option);
    const poke = await getPokemonFromApi(target.id) ??
      await getPokemonFromApi(target.specie);

    if (!poke) {
      return "No se pudo encontrar información sobre el pokémon.";
    }

    return <Embed> {
      title: `${poke.name[0]?.toUpperCase() + poke.name.slice(1)} #${poke.id}`,
      color: randomHex(),
      footer: {
        text: "Thanks to PokéAPI for existing!",
        url: "https://pokeapi.co/static/pokeapi_256.888baca4.png",
      },
      description: poke.stats.map((value) =>
        `${value.stat.name}: \`${value.base_stat}\``
      ).join("\n"),
      fields: [
        {
          name: "Abilities",
          value: poke.abilities.map((ab) => ab.ability.name).join(" "),
        },
        {
          name: "Types",
          value: poke.types.map((tp) => tp.type.name).join(" "),
        },
        {
          name: "Etc",
          value: [
            `**Weight**: ${parsePokemonWeight(poke.weight)}kg`,
            `**Height**: ${poke.height}cm`,
          ].join("\n"),
        },
      ],
      image: {
        url: poke.sprites.front_default,
      },
      thumbnail: {
        url: poke.sprites.front_shiny,
      },
    };
  },
};
