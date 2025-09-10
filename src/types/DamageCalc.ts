import type { State } from "@smogon/calc";
import type { SetId } from "./PokemonSet";
import type { TeamId } from "./PokemonTeam";
import type { StatName } from "./Stats";

export type CalcId = string;

export interface DamageCalc {
  id: CalcId;
  teamId: TeamId;
  attacker?: {
    setId: SetId;
    boosts?: Partial<Record<StatName, number>>;
  };
  move?: string;
  defender?: {
    setId: SetId;
    boosts?: Partial<Record<StatName, number>>;
  }
  field?: Partial<State.Field>;
  cachedResult?: DamageCalcResult;
}


export interface DamageCalcResult {
  calcId: CalcId,
  koChance: string;
  percentRange: [number, number]
}
