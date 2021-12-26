// deno-lint-ignore-file camelcase

export interface ApiResource {
  name: string;
  url: string;
}

export interface Pokemon {
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

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: ApiResource;
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  front_female?: string;
  front_shinyFemale?: string;

  back_default: string;
  back_shiny: string;
  back_female?: string;
  backShiny_female?: string;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: ApiResource;
}

export interface PokemonType {
  slot: number;
  type: ApiResource;
}

export interface PokemonTarget {
  id: number;
  specie: string;
  shiny: boolean;
  mega: boolean;
}
