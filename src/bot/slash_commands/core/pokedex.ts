import type { Pokemon, PokemonTarget } from "../../types/pokeapi.ts";
import { type Context, Command, MessageEmbed, Option } from "oasis";
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
@Option({
  name: "search",
  description: "🔎",
  required: true,
  type: ApplicationCommandOptionTypes.String,
})
@Command({
  name: "dex",
  description: "Comando para buscar un pokémon por su nombre o id",
  meta: {
    descr: "Comando para buscar un pokémon por su nombre o id",
    short: "Busca pokemones",
    usage: "<Nombre o id>",
  },
  category: Category.Util,
})
export default class {
  static async execute({ interaction }: Context) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    const target = parseMessageToPokemon(option.value as string);
    const poke = await getPokemonFromApi(target.id) ?? await getPokemonFromApi(target.specie);

    if (!poke) {
      return "No se pudo encontrar información sobre el pokémon.";
    }

    const embed = MessageEmbed
      .new()
      .title(`${poke.name[0]?.toUpperCase() + poke.name.slice(1)} #${poke.id}`)
      .color(randomHex())
      .footer("Thanks to PokéAPI for existing!", "https://pokeapi.co/static/pokeapi_256.888baca4.png")
      .description(poke.stats.map((value) => `${value.stat.name}: \`${value.base_stat}\``).join("\n"))
      .field("Abilities", poke.abilities.map((ab) => ab.ability.name).join(" "))
      .field("Types", poke.types.map((tp) => tp.type.name).join(" "))
      .field("Etc", `**Weight**: ${parsePokemonWeight(poke.weight)}kg\n**Height**: ${poke.height}`)
      .image(poke.sprites.front_default)
      .thumbnail(poke.sprites.front_shiny)
      .end();

    return embed;
  }
}
