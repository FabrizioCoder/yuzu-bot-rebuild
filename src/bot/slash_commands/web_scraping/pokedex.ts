import type { Command } from "../../types/command.ts";
import type { Pokemon, PokemonTarget } from "../../types/pokeapi.ts";
import type { Embed } from "discordeno";
import { Api, Category, randomHex } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";
import { default as f } from "axiod";

async function getPokemonFromApi(pokemon: string | number) {
  try {
    const { data } = await f.get<Pokemon>(`${Api.PokeApi}/pokemon/${pokemon}`);

    return Promise.resolve(data);
  } catch {
    return;
  }
}

function parseMessageToPokemon(message: string) {
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

function parsePokemonWeight(weight: number) {
  let strWeight = weight.toString();
  const len = strWeight.length;

  if (len === 1) strWeight = `0.${strWeight}`;
  else if (len >= 2) strWeight = strWeight.slice(0, len - 1);
  return strWeight;
}

// Command...

export default <Command> {
  options: {
    isGuildOnly: false,
    information: {
      descr: "Comando para buscar un pokémon por su nombre o id",
      short: "Busca pokemones",
      usage: "<Nombre o id>",
    },
  },
  category: Category.Util,
  data: {
    name: "dex",
    description: "Comando para buscar un pokémon por su nombre o id",
  },
  async execute({ interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return "Debes ingresar más información del pokémon para buscarlo.";
    }

    const target = parseMessageToPokemon(option.value as string);
    const poke = await getPokemonFromApi(target.id) ?? await getPokemonFromApi(target.specie);

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
      description: poke.stats.map((value) => `${value.stat.name}: \`${value.base_stat}\``).join("\n"),
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
          value: [`**Weight**: ${parsePokemonWeight(poke.weight)}kg`, `**Height**: ${poke.height}`].join("\n"),
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
