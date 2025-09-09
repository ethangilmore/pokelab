import type { SetId } from "./PokemonSet";
import type { TeamId } from "./PokemonTeam";

export type CalcId = string;

export interface DamageCalc {
  id: CalcId;
  teamId: TeamId;
  attacker?: {
    setId: SetId;
  };
  move?: string;
  defender?: {
    setId: SetId;
  }
  cachedResult?: DamageCalcResult
}


export interface DamageCalcResult {
  calcId: CalcId,
  koChance: string;
  percentRange: [number, number]
}
