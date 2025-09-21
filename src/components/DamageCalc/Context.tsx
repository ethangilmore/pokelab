import type { DamageCalc } from "@/types/DamageCalc";
import type { SetId } from "@/types/PokemonSet";
import type { StatName } from "@/types/Stats";
import { createContext, useContext } from "react";

type DamageCalcContext = {
  calc: DamageCalc;
  updateSet: (side: "attacker" | "defender", setId: SetId) => void;
  updateStatBoosts: (side: "attacker" | "defender", boosts: Partial<Record<StatName, number>>) => void;
  updateMove: (move: string) => void;
  updateSideConditions: (side: any, patch: any) => void;
  updateFieldConditions: (patch: any) => void;
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
}

export const DamageCalcContext = createContext<DamageCalcContext | null>(null);

export const useDamageCalc = () => {
  const context =  useContext(DamageCalcContext);
  if (!context) throw new Error("Using Damage Calc Context outside of Dropdown Provider");
  return context;
}

