import type { CalcId, DamageCalc } from "@/types/DamageCalc";
import { useCalc, useCalcActions } from "@/hooks/useStore";
import { SetDropdown } from "./SetDropdown";
import { MoveDropdown } from "./MoveDropdown";
import { useState } from "react";
import { StatBoosts } from "./StatBoosts";
import { SideConditions } from "./SideConditions";
import { FieldConditions } from "./FieldConditions";
import { SideChips } from "./SideChips";
import type { SetId } from "@/types/PokemonSet";
import { Result } from "./Result";
import { DamageCalcContext } from "./Context";
import type { StatName } from "@/types/Stats";
import { FieldChips } from "./FieldChips";

export function DamageCalc({ calcId }: { calcId: CalcId }) {
  const calc = useCalc(calcId);
  const { updateCalc } = useCalcActions();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!calc) return;

  const contextValue = {
    calc,
    updateSet: (side: "attacker"|"defender", setId: SetId) => {
      updateCalc(calcId, {
        [side]: {
          ...calc[side],
          setId
        }
      });
    },
    updateMove: (move: string) => {
      updateCalc(calcId, {
        move
      })
    },
    updateStatBoosts: (side: "attacker"|"defender", patch: Partial<Record<StatName, number>>) => {
      updateCalc(calcId, {
        [side]: {
          ...calc[side],
          boosts: {
            ...calc[side].boosts,
            ...patch
          }
        }
      })
    },
    updateSideConditions: () => {},
    updateFieldConditions: () => {},
    isOpen,
    setIsOpen
  }

  return (
    <DamageCalcContext.Provider value={contextValue}>
      <div className="m-[4px] shadow rounded bg-green-400 mt-2 text-xs sm:text-sm md:text-base">
        <div className="rounded bg-gray-100 shadow">
          <div className="text-xs md:text-sm grid grid-cols-[auto_auto] justify-between gap-1 rounded">
            <SideChips side="attacker" />
            <SideChips side="defender" className="flex-row-reverse" />
          </div>
          <div className="-mx-[2px] p-1 grid grid-cols-[2fr_8rem_2fr] gap-1 rounded bg-white shadow">
            <SetDropdown side="attacker" />
            <MoveDropdown />
            <SetDropdown side="defender" />
          </div>
          <FieldChips />
        </div>
        { isOpen && (
          <div className="bg-gray-100 flex justify-between">
            <StatBoosts side="attacker" />
            <div className="flex justify-between gap-1 p-1">
              <SideConditions side="attackerSide" />
              <FieldConditions />
              <SideConditions side="defenderSide" />
            </div>
            <StatBoosts side="defender" />
          </div>
        )}
        <Result />
      </div>
    </DamageCalcContext.Provider>
  )
}
