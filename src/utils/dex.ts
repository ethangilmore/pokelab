import learnsets from "@/data/learnsets";
import pokedex from "@/data/pokedex";
import { type Move } from "@/data/moves";
import type { PokemonSet } from "@/types/PokemonSet";
import type { Type, Typing } from "@/types/Typing";
import type { StatName } from "@/types/Stats";
import { Dex } from "@pkmn/dex";
import { Sprites } from "@pkmn/img";

export function getBaseSpecies(species: string): string {
  return Dex.species.get(species).baseSpecies;
}

export function getLearnSet(species: string): string[] {
  species = getBaseSpecies(species).toLowerCase().replace('-', '');
  const id = Dex.species.get(species).id;
  return Object.keys(learnsets[id].learnset).map((move) => Dex.moves.get(move).name);
}

export function getMove(move: string): Move {
  return Dex.moves.get(move);
}

export function getSpriteURL(species: string): string {
  const { url } = Sprites.getDexPokemon(species);
  return url;
}

export function getTyping(species: string): Typing {
  species = species.toLowerCase().replace('-', '');
  const raw = pokedex[species].types.map((t) => t.toLowerCase() as Type);

  if (raw.length === 1) {
    return [raw[0]] as Typing;
  } else {
    return [raw[0], raw[1]] as readonly [Type, Type] as Typing;
  }
}

export function getBaseStats(species: string): Record<StatName, number> {
  return Dex.species.get(species).baseStats;
}

export function getAbilities(species: string): string[] {
  return Object.values(Dex.species.get(species).abilities);
}

export function getDefaultSet(species: string): Omit<PokemonSet,"id"|"teamid"> {
  return {
    name: species,
    species: species,
    ability: getAbilities(species)[0],
    nature: "Hardy",
    moves: [],
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  };
}
