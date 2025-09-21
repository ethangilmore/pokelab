import type { DamageCalcResult } from "@/types/DamageCalc";
import type { StatName } from "@/types/Stats";
import { calculate, Field, Generations, Move, Pokemon, type State } from "@smogon/calc";

export type CalcSet = {
  species: string,
  item?: string,
  nature?: string,
  ivs?: Partial<Record<StatName, number>>,
  evs?: Partial<Record<StatName, number>>,
  boosts?: Partial<Record<StatName, number>>,
}

export type CalcJobInput = {
  calcId: string;
  attacker: CalcSet,
  defender: CalcSet,
  move: string
  field?: State.Field,
}

self.onmessage = (event: MessageEvent<{ batchNum: number, jobs: CalcJobInput[] }>) => {
  const { batchNum, jobs } = event.data;
  const results: DamageCalcResult[] = [];
  for (const job of jobs) {
    try {
      const gen = Generations.get(9);
      const result = calculate(
        gen,
        new Pokemon(gen, job.attacker.species, job.attacker),
        new Pokemon(gen, job.defender.species, job.defender),
        new Move(gen, job.move),
        new Field(job.field)
      );
      results.push({
        calcId: job.calcId,
        koChance: result.kochance().text,
        percentRange: result.range().map((dmg) => dmg/result.defender.maxHP()) as [number, number]
      });
    } catch (err) {
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
