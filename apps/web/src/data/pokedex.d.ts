import type { Typing } from "@/types/Typing";

declare const pokedex: Record<string, {
  num: number;
  name: string;
  types: Typing
  genderRatio?: { M: number; F: number };
  baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  abilities: { [key: string]: string };
  heightm: number;
  weightkg: number;
  color: string;
  evos?: string[];
  eggGroups: string[];
  tier: string;
}>;

export default pokedex; 
