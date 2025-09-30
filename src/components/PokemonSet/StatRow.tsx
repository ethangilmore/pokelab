import type { StatName } from "@/types/Stats"
import { usePokemonSet } from "./Context";
import { getBaseStats } from "@/utils/dex";
import { PlusIcon } from "@heroicons/react/20/solid";
import { MinusIcon } from "@heroicons/react/20/solid";

type StatRowProps = {
  stat: StatName;
}

export function StatRow({ stat }: StatRowProps) {
  const { set, updateSetIvs, updateSetEvs } = usePokemonSet();

  const iv = set.ivs[stat] ?? 0;
  const ev = set.evs[stat] ?? 0;

  const baseValue = getBaseStats(set.species)[stat];
  const enhancedValue = Math.round(baseValue + (iv * 50) / 100 + (ev * 50) / 400);

  return (
    <>
      <div>{stat}</div>
      <div className="flex-1 bg-gray-200 rounded-full overflow-hidden relative">
        <div
          className={`bg-blue-400 opacity-60 absolute inset-0 rounded-full h-full`}
          style={{ width: `${(enhancedValue / 255) * 100}%` }}
        />
        <div
          className={`bg-blue-500 border-r border-white absolute inset-0 rounded-full h-full`}
          style={{ width: `${(baseValue / 255) * 100}%` }}
        />
      </div>
      <input
        className="rounded border max-w-[3em]"
        type="number"
        min={0}
        max={31}
        value={iv}
        onChange={(e) => updateSetIvs({ [stat]: Number(e.target.value) })}
      />
      <input
        className="min-w-16"
        type="range"
        min={0}
        max={252}
        value={ev}
        onChange={(e) => updateSetEvs({ [stat]: e.target.value })}
      />
      <div className="min-w-[2em] text-center m-auto">
        {ev}
      </div>
      <div className="flex flex-row rounded border divide-x bg-white">
        <MinusIcon className="min-h-full size-[1em]" />
        <PlusIcon className="min-h-full size-[1em]" />
      </div>
    </>
  )
}
