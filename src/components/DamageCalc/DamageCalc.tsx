import type { CalcId, DamageCalc, DamageCalcResult } from "@/types/DamageCalc";
import { useCalc, useCalcActions } from "@/hooks/useStore";
import { SetDropdown } from "./SetDropdown";
import { MoveDropdown } from "./MoveDropdown";
import { useState } from "react";

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
        <div className="p-1 empty:p-0 empty:h-1 text-xs md:text-sm flex gap-1 overflow-x-hidden">
          {Object.values(field).map((effect) => (
            <div className="bg-white px-2 rounded align-middle p-1 min-w-max">{effect}</div>
          ))}
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
        <div className="text-xs md:text-sm grid grid-cols-[auto_auto] justify-between gap-1 rounded">
          <div className="p-1 empty:p-0 empty:h-1 flex gap-1">
            {Object.keys(attackerSide ?? {}).map((effect) => (
              <div className="bg-white md:px-2 rounded align-middle p-1 min-w-max">{effect}</div>
            ))}
          </div>
          <div className="p-1 empty:p-0 empty:h-1 flex flex-row-reverse gap-1">
            {Object.keys(defenderSide ?? {}).map((effect) => (
              <div className="bg-white md:px-2 rounded align-middle p-1 min-w-max">{effect}</div>
            ))}
          </div>
        </div>
      </div>
      { isOpen && (
        <div className="bg-gray-100 grid grid-cols-[1fr_auto_1fr] divide-x">
          <div className="flex flex-col items-start gap-1 p-1">
            <div className="flex flex-col rounded border">
              {["Reflect", "Light Screen", "Aurora Veil"].map(x => 
                <button className="rounded border p-1">{x}</button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 p-1">
            <div className="rounded border divide-x">
              {["Terrain"].map(x => 
                <button className="p-1">{x}</button>
              )}
            </div>
            <div className="rounded border divide-x">
              {["Weather"].map(x => 
                <button className="p-1">{x}</button>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 p-1">
            <div className="flex flex-col rounded border">
              {["Reflect", "Light Screen", "Aurora Veil"].map(x => 
                <button className="rounded border p-1">{x}</button>
              )}
            </div>
          </div>
        </div>
      )}
      <ResultCell result={calc.cachedResult} onClick={() => setIsOpen(!isOpen)} />
    </div>
  )
}
