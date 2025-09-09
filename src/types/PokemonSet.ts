import type { StatName } from '@/types/Stats'
import type { Nature } from '@/types/Natures'
import type { TeamId } from './PokemonTeam';

export type SetId = string;

export interface PokemonSet {
  id: SetId;
  teamId?: TeamId;
  calcIds?: string[];
  name?: string;
  species: string;
  ability: string;
  moves: string[];
  nature: Nature;
  item?: string;
  evs: Record<StatName, number>;
  ivs: Record<StatName, number>;
}
