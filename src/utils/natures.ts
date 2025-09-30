import { STATS, type StatName } from "@/types/Stats";

export const NATURES = [
  "Hardy", "Lonely", "Adamant", "Naughty", "Brave",
  "Bold", "Docile", "Impish", "Lax", "Relaxed",
  "Modest", "Mild", "Bashful", "Rash", "Quiet",
  "Calm", "Gentle", "Careful", "Quirky", "Sassy",
  "Timid", "Hasty", "Jolly", "Naive", "Serious"
]

export type Nature = typeof NATURES[number];

export type NatureEffects = { plus: StatName, minus: StatName }

const statsNoHP = STATS.slice(1)

export function getNatureEffect(nature: Nature): NatureEffects {
  const idx = NATURES.indexOf(nature);
  return {
    plus: statsNoHP[Math.floor(idx/5)],
    minus: statsNoHP[idx%5]
  }
}

export function getNature(effects: NatureEffects): Nature {
  const idx = statsNoHP.indexOf(effects.plus)*5 + statsNoHP.indexOf(effects.minus);
  return NATURES[idx];
}
