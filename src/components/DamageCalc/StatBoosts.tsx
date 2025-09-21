import type { StatName } from "@/types/Stats";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useDamageCalc } from "./Context";

type StatBoostsProps = {
  side: "attacker" | "defender";
}

export function StatBoosts({ side }: StatBoostsProps) {
  const { calc, updateStatBoosts } = useDamageCalc();

  if (!calc) return;

  const updateStat = (stat: StatName, update: (val: number | undefined) => number) => {
    return () => {
      updateStatBoosts(side, { [stat]: update(calc[side].boosts?.[stat]) })
    }
  }

  const inc = (val: number | undefined) => Math.min(6, (val ?? 0) + 1);
  const dec = (val: number | undefined) => Math.max(-6, (val ?? 0) - 1);

  return (
    <div className="flex flex-col gap-1 p-1 max-w-min">
      {(["atk", "spa", "def", "spd", "spe"] as StatName[]).map((stat) => (
        <div key={stat} className="flex items-center gap-1 justify-between">
          <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
          <div className="flex rounded border bg-white">
            <button
              onClick={updateStat(stat, dec)}
              className={`min-w-4 p-px ${(calc[side]?.boosts?.[stat]??0) < 0 && 'bg-gray-200'}`}
            >
              <MinusIcon />
            </button>
            <span className="p-[2px] px-1 border-x min-w-[1.5rem] text-center">
              {Intl.NumberFormat('en-us', { signDisplay: 'always' }).format(calc[side].boosts?.[stat] ?? 0)}
            </span>
            <button
              onClick={updateStat(stat, inc)}
              className={`min-w-4 p-px ${(calc[side]?.boosts?.[stat]??0) > 0 && 'bg-gray-200'}`}
            >
              <PlusIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
