import type { CalcId, DamageCalc, DamageCalcResult } from "@/types/DamageCalc";
import { useCalc, useCalcActions } from "@/hooks/useStore";
import { SetDropdown } from "./SetDropdown";
import { MoveDropdown } from "./MoveDropdown";
import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import type { StatName } from "@/types/Stats";

function ResultCell({ result, onClick }: { result?: DamageCalcResult, onClick?: () => void }) {
  return (
      <button className="size-full p-1 text-center sm:text-sm" onClick={onClick}>
        {result ? `${(100*result.percentRange[0]).toFixed(1)} - ${(100*result.percentRange[1]).toFixed(1)}%${result.koChance && " - "+result.koChance}` : "Select Move"}
      </button>
  )
}

export function DamageCalc({ calcId }: { calcId: CalcId }) {
  const calc = useCalc(calcId);
  const { updateCalc } = useCalcActions();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!calc) return <></>;
  const { attackerSide, defenderSide, ...field } = calc.field ?? {};

  return (
    <div className="m-[4px] shadow rounded bg-green-400 mt-2 text-xs sm:text-sm md:text-base">
      <div className="rounded bg-gray-100 shadow">
        <div className="text-xs md:text-sm grid grid-cols-[auto_auto] justify-between gap-1 rounded">
          <div className="p-1 empty:p-0 empty:h-1 flex gap-1">
            {Object.entries(calc.attacker.boosts ?? {}).filter(([_, value]) => value).map(([stat, value]) => (
              <div className="bg-white md:px-2 rounded align-middle p-1 min-w-max">
              {stat.charAt(0).toUpperCase() + stat.slice(1)} {Intl.NumberFormat('en-us', { signDisplay: 'always' }).format(value)}
              </div>
            ))}
          </div>
          <div className="p-1 empty:p-0 empty:h-1 flex flex-row-reverse gap-1">
            {Object.entries(calc.defender.boosts ?? {}).filter(([_, value]) => value).map(([stat, value]) => (
              <div className="bg-white md:px-2 rounded align-middle p-1 min-w-max">
              {stat.charAt(0).toUpperCase() + stat.slice(1)} {Intl.NumberFormat('en-us', { signDisplay: 'always' }).format(value)}
              </div>
            ))}
          </div>
        </div>
        <div className="-mx-[2px] p-1 grid grid-cols-[2fr_8rem_2fr] gap-1 rounded bg-white shadow">
          <SetDropdown setId={calc.attacker?.setId} onSetChange={(setId) => {
            updateCalc(calcId, {
              attacker: { setId },
            });
          }}/>
          <MoveDropdown attackerId={calc.attacker?.setId} move={calc.move} onMoveChange={(move) => {
            updateCalc(calcId, { move })
          }}/>
          <SetDropdown setId={calc.defender?.setId} onSetChange={(setId) => {
            updateCalc(calcId, {
              defender: { setId }
            });
          }}/>
        </div>
        <div className="p-1 empty:p-0 empty:h-1 text-xs md:text-sm flex gap-1 overflow-x-hidden">
          {Object.values(field).map((effect) => (
            <div className="bg-white px-2 rounded align-middle p-1 min-w-max">{effect}</div>
          ))}
        </div>
      </div>
      { isOpen && (
        <div className="bg-gray-100 grid grid-cols-[1fr_1fr_1fr]">
          <div className="flex flex-col gap-1 p-1 max-w-min">
            {(["atk", "spa", "def", "spd", "spe"] as StatName[]).map((stat) => (
              <div className="flex items-center gap-1 justify-between">
                <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                <div className="flex items-center rounded border bg-white">
                  <button onClick={() => {
                    updateCalc(calcId, {
                      attacker: {
                        ...calc.attacker,
                        boosts: {
                          ...calc.attacker.boosts,
                          [stat]: Math.max(-6, (calc.attacker.boosts?.[stat] ?? 0) - 1),
                        }
                      }
                    });
                  }} className="p-[2px] size-4"><MinusIcon /></button>
                  <span className="p-[2px] px-1 border-x font-mono">
                    {Intl.NumberFormat('en-us', { signDisplay: 'always' }).format(calc.attacker.boosts?.[stat] ?? 0)}
                  </span>
                  <button onClick={() => {
                    updateCalc(calcId, {
                      attacker: {
                        ...calc.attacker,
                        boosts: {
                          ...calc.attacker.boosts,
                          [stat]: Math.min(6, (calc.attacker.boosts?.[stat] ?? 0) + 1),
                        }
                      }
                    });
                  }} className="p-[2px] size-4"><PlusIcon /></button>
                </div>
              </div>
            ))}
            {/*<button className="rounded border py-1 px-2 bg-white min-w-max">+ Side Condition</button>*/}
          </div>
          <div className="flex flex-col justify-center items-center gap-1 p-1">
            {/*<button className="rounded border p-1 bg-white">+ Field Condition</button>*/}
          </div>
          <div className="flex flex-col gap-1 p-1 max-w-min ml-auto">
            {(["atk", "spa", "def", "spd", "spe"] as StatName[]).map((stat) => (
              <div className="flex items-center gap-1 justify-between">
                <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                <div className="flex items-center rounded border bg-white">
                  <button onClick={() => {
                    updateCalc(calcId, {
                      defender: {
                        ...calc.defender,
                        boosts: {
                          ...calc.defender.boosts,
                          [stat]: Math.max(-6, (calc.defender.boosts?.[stat] ?? 0) - 1),
                        }
                      }
                    });
                  }} className="p-[2px] size-4"><MinusIcon /></button>
                  <span className="p-[2px] px-1 border-x font-mono">
                  {Intl.NumberFormat('en-us', { signDisplay: 'always' }).format(calc.defender.boosts?.[stat] ?? 0)}
                  </span>
                  <button onClick={() => {
                    updateCalc(calcId, {
                      defender: {
                        ...calc.defender,
                        boosts: {
                          ...calc.defender.boosts,
                          [stat]: Math.min(6, (calc.defender.boosts?.[stat] ?? 0) + 1),
                        }
                      }
                    });
                  }} className="p-[2px] size-4"><PlusIcon /></button>
                </div>
              </div>
            ))}
            {/*<button className="rounded border py-1 px-2 bg-white min-w-max">+ Side Condition</button>*/}
          </div>
        </div>
      )}
      <ResultCell result={calc.cachedResult} onClick={() => setIsOpen(!isOpen)} />
    </div>
  )
}
