import type { Pokemon, PokemonTarget } from "../../types/pokeapi.ts";
import { createCommand, createMessageCommand, ChatInputApplicationCommandBuilder, MessageEmbed } from "oasis";
import { Api, Category, randomHex, translate } from "utils";
import { ApplicationCommandOptionTypes } from "discordeno";

async function getPokemonFromApi(pokemon: string | number) {
  try {
    const data: Pokemon | undefined = await fetch(`${Api.PokeApi}pokemon/${pokemon}`).then((a) => a.json());

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
    return <PokemonTarget>Object.assign(base, {
      id: parseInt(message),
      specie: "",
    });
  } else {
    return <PokemonTarget>Object.assign(base, {
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

createCommand({
  meta: {
    descr: "commands:pokedex:DESCRIPTION",
    usage: "commands:pokedex:USAGE",
  },
  category: Category.Util,
  translated: true,
  async execute({ bot, interaction }) {
    const option = interaction.data?.options?.[0];

    if (option?.type !== ApplicationCommandOptionTypes.String) {
      return;
    }

    const target = parseMessageToPokemon(option.value as string);
    const poke = (await getPokemonFromApi(target.id)) ?? (await getPokemonFromApi(target.specie));

    if (!poke) {
      return "commands:pokedex:ON_INVALID_POKEMON";
    }

    const { embed } = new MessageEmbed()
      .title(`${poke.name[0]?.toUpperCase() + poke.name.slice(1)} #${poke.id}`)
      .color(randomHex())
      .footer("Thanks to PokéAPI for existing!", "https://pokeapi.co/static/pokeapi_256.888baca4.png")
      .description(poke.stats.map((value) => `${value.stat.name}: \`${value.base_stat}\``).join("\n"))
      .field(
        await translate(bot, "commands:pokedex:EMBED_FIELDNAME_ABILITIES", interaction.guildId),
        poke.abilities.map((ab) => ab.ability.name).join(" ")
      )
      .field(
        await translate(bot, "commands:pokedex:EMBED_FIELDNAME_TYPES", interaction.guildId),
        poke.types.map((tp) => tp.type.name).join(" ")
      )
      .field("Etc", `**Weight**: ${parsePokemonWeight(poke.weight)}kg\n**Height**: ${poke.height}`)
      .image(poke.sprites.front_default)
      .thumbnail(poke.sprites.front_shiny);

    return embed;
  },
  data: new ChatInputApplicationCommandBuilder()
    .setName("pokedex")
    .setDescription("Searches for a pokemon by its name or id")
    .addStringOption((o) => o.setName("query").setDescription("Name or id").setRequired(true))
    .toJSON(),
});

// Command...
createMessageCommand({
  names: ["pokedex", "dex"],
  meta: {
    descr: "commands:pokedex:DESCRIPTION",
    usage: "commands:pokedex:USAGE",
  },
  category: Category.Util,
  translated: true,
  async execute({ bot, message, args: { args } }) {
    const option = args.join(" ");

    if (!option) {
      return "commands:pokedex:ON_INVALID_POKEMON";
    }

    const target = parseMessageToPokemon(option);
    const poke = (await getPokemonFromApi(target.id)) ?? (await getPokemonFromApi(target.specie));

    if (!poke) {
      return "commands:pokedex:ON_INVALID_POKEMON";
    }

    const { embed } = new MessageEmbed()
      .title(`${poke.name[0]?.toUpperCase() + poke.name.slice(1)} #${poke.id}`)
      .color(randomHex())
      .footer("Thanks to PokéAPI for existing!", "https://pokeapi.co/static/pokeapi_256.888baca4.png")
      .description(poke.stats.map((value) => `${value.stat.name}: \`${value.base_stat}\``).join("\n"))
      .field(
        await translate(bot, "commands:pokedex:EMBED_FIELDNAME_ABILITIES", message.guildId),
        poke.abilities.map((ab) => ab.ability.name).join(" ")
      )
      .field(
        await translate(bot, "commands:pokedex:EMBED_FIELDNAME_TYPES", message.guildId),
        poke.types.map((tp) => tp.type.name).join(" ")
      )
      .field("Etc", `**Weight**: ${parsePokemonWeight(poke.weight)}kg\n**Height**: ${poke.height}`)
      .image(poke.sprites.front_default)
      .thumbnail(poke.sprites.front_shiny);

    return embed;
  },
});
