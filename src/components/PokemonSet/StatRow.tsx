import type { StatName } from "@/types/Stats"
import { usePokemonSet } from "./Context";
import { getBaseStats } from "@/utils/dex";
import { PlusIcon } from "@heroicons/react/20/solid";
import { MinusIcon } from "@heroicons/react/20/solid";
import { getNature, getNatureEffect } from "@/utils/natures";
import { Button } from "../Button";

type StatRowProps = {
  stat: StatName;
}

export function StatRow({ stat }: StatRowProps) {
  const { set, updateSet, updateSetIvs, updateSetEvs } = usePokemonSet();

  const iv = set.ivs[stat] ?? 0;
  const ev = set.evs[stat] ?? 0;

  const baseValue = getBaseStats(set.species)[stat];
  const enhancedValue = Math.round(baseValue + (iv * 50) / 100 + (ev * 50) / 400);
  const { plus, minus } = getNatureEffect(set.nature);

  return (
    <>
      <div>{stat}</div>
      <div className="flex-1 bg-tertiary rounded-full overflow-hidden relative">
        <div
          className={`bg-blue-400 opacity-60 absolute inset-0 rounded-full`}
          style={{ width: `${(enhancedValue / 255) * 100}%` }}
        />
        <div
          className={`bg-blue-500 absolute inset-0 rounded-full`}
          style={{ width: `${(baseValue / 255) * 100}%` }}
        />
      </div>
      <input
        className="rounded border max-w-[3em] px-px"
        type="number"
        min={0}
        max={31}
        value={iv}
        onChange={(e) => updateSetIvs({ [stat]: Number(e.target.value) })}
      />
      <input
        className="min-w-16 appearance-none bg-tertiary h-1/4 rounded full my-auto"
        type="range"
        min={0}
        max={252}
        value={ev}
        onChange={(e) => updateSetEvs({ [stat]: Number(e.target.value) })}
      />
      <div className="min-w-[2em] text-center m-auto">
        {ev}
      </div>
      {stat !== "hp" ? <div className="flex flex-row rounded border divide-x overflow-hidden">
        <Button
          className={`${stat === minus && 'bg-sky-500 text-white'}`}
          onClick={() => {
            updateSet({ nature: getNature({ plus, minus: stat }) })
          }}
        >
          <MinusIcon className="min-h-full size-[1em]" />
        </Button>
        <Button
          className={`${stat === plus && 'bg-red-400 hover:bg-red-400 text-white'}`}
          onClick={() => {
            updateSet({ nature: getNature({ plus: stat, minus }) })
          }}
        >
          <PlusIcon className="min-h-full size-[1em]" />
        </Button>
      </div> : <div/>}
    </>
  )
}
