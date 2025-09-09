// @ts-ignore
import CalcWorker from "@/workers/calcWorker?worker"
import type { CalcJobInput } from "./calcWorker";
import type { CalcId, DamageCalcResult } from "@/types/DamageCalc";

const worker = new CalcWorker();

let _batchNum = 0;
let _latestBatchForCalc = new Map<CalcId, number>();

let listener: (resp: { batchNum: number, results: DamageCalcResult[] }) => void = (_) => {}

worker.onmessage = (e: MessageEvent<{ batchNum: number, results: DamageCalcResult[] }>) => {
  listener(e.data);
}

export function runCalcJobs(jobs: CalcJobInput[], callback: (results: DamageCalcResult[]) => void) {
  const batchNum = ++_batchNum;

  jobs.forEach((job) => {
    _latestBatchForCalc.set(job.calcId, batchNum);
  });

  listener = (response) => {
    const freshResults = response.results.filter((result) => 
      _latestBatchForCalc.get(result.calcId) === response.batchNum
    )
    callback(freshResults);
  }
  worker.postMessage({ batchNum, jobs });
}

