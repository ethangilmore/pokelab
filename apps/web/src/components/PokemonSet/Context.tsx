import type { PokemonSet } from "@/types/PokemonSet";
import type { StatName } from "@/types/Stats";
import { createContext, useContext } from "react";

type PokemonSetContext = {
  set: PokemonSet;
  updateSet: (patch: Partial<PokemonSet>) => void;
  updateSetIvs: (patch: Partial<Record<StatName, number>>) => void;
  updateSetEvs: (patch: Partial<Record<StatName, number>>) => void;
}

export const PokemonSetContext = createContext<PokemonSetContext | null>(null);

export const usePokemonSet = () => {
  const context =  useContext(PokemonSetContext);
  if (!context) throw new Error("Using Pokemon Set Context outside of Pokemon Set Provider");
  return context;
}

