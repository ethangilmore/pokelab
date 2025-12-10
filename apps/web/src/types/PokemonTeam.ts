import type { SetId } from "@/types/PokemonSet";
import type { CalcId } from "@/types/DamageCalc";

export type TeamId = string;

export interface PokemonTeam {
  id: TeamId;
  name: string;
  sets: SetId[];
  calcs: CalcId[];
}
