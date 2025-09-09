import { Team } from '@pkmn/sets';
import type { PokemonSet } from '@/types/PokemonSet';
import { getAbilities } from './dex';

export function exportSets(sets: PokemonSet[]): string {
  return new Team(sets).toString();
}

export function importSets(data: string): Omit<PokemonSet,"id"|"teamid">[] {
  const team = Team.fromString(data);
  const sets: Omit<PokemonSet,"id"|"teamid">[] = []
  for (const set of team?.team ?? []) {
    if (!set.species) continue;
    sets.push({
      name: set.name,
      species: set.species,
      ability: set.ability ?? getAbilities(set.species)[0],
      item: set.item,
      moves: set.moves ?? [],
      nature: set.nature ?? "docile",
      ivs: set.ivs ?? { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      evs: set.evs ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    })
  } 
  return sets;
}
