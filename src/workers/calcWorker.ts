import type { DamageCalcResult } from "@/types/DamageCalc";
import type { StatName } from "@/types/Stats";
import { calculate, Generations, Move, Pokemon } from "@smogon/calc";

export type CalcSet = {
  species: string,
  item?: string,
  nature?: string,
  ivs?: Partial<Record<StatName, number>>,
  evs?: Partial<Record<StatName, number>>,
}

export type CalcJobInput = {
  calcId: string;
  attacker: { set: CalcSet },
  defender: { set: CalcSet },
  move: string
}

self.onmessage = (event: MessageEvent<{ batchNum: number, jobs: CalcJobInput[] }>) => {
  const { batchNum, jobs } = event.data;
  const results: DamageCalcResult[] = [];
  for (const job of jobs) {
    try {
      const gen = Generations.get(9);
      const result = calculate(
        gen,
        new Pokemon(gen, job.attacker.set.species, {
          item: job.attacker.set.item,
          nature: job.attacker.set.nature,
          ivs: job.attacker.set.ivs,
          evs: job.attacker.set.evs,
        }),
        new Pokemon(gen, job.defender.set.species, {
          item: job.defender.set.item,
          nature: job.defender.set.nature,
          ivs: job.defender.set.ivs,
          evs: job.defender.set.evs,
        }),
        new Move(gen, job.move),
      );
      results.push({
        calcId: job.calcId,
        koChance: result.kochance().text,
        percentRange: result.range().map((dmg) => dmg/result.defender.maxHP()) as [number, number]
      });
    } catch (err) {
      console.error(err);
      results.push({
        calcId: job.calcId,
        koChance: "",
        percentRange: [0, 0]
      });
      // TODO: handle this somehow
    }
  }
  self.postMessage({ batchNum, results });
}
