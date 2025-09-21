import type { DamageCalc } from "@/types/DamageCalc";
import type { SetId } from "@/types/PokemonSet";
import type { StatName } from "@/types/Stats";
import type { State } from "@smogon/calc";
import { createContext, useContext } from "react";

type DamageCalcContext = {
  calc: DamageCalc;
  updateSet: (side: "attacker" | "defender", setId: SetId) => void;
  updateStatBoosts: (side: "attacker" | "defender", boosts: Partial<Record<StatName, number>>) => void;
  updateMove: (move: string) => void;
  updateSideConditions: (side: "attacker" | "defender", patch: Partial<State.Side>) => void;
  updateFieldConditions: (patch: Partial<State.Field>) => void;
  getSideConditions: (side: "attacker" | "defender") => any[];
  getFieldConditions: () => any[];
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
}

export const DamageCalcContext = createContext<DamageCalcContext | null>(null);

export const useDamageCalc = () => {
  const context =  useContext(DamageCalcContext);
  if (!context) throw new Error("Using Damage Calc Context outside of Dropdown Provider");
  return context;
}

