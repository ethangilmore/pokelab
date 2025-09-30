import type { CalcId, DamageCalc } from "@/types/DamageCalc";
import { useCalc, useCalcActions } from "@/hooks/useStore";
import { SetDropdown } from "./SetDropdown";
// import { MoveDropdown } from "./MoveDropdown";
import { MoveDropdown } from "@/components/MoveDropdown";
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
import type { State } from "@smogon/calc";

export const sideKeys: Partial<Record<keyof State.Side, string>> = {
  isReflect: 'Reflect',
  isLightScreen: 'Light Screen',
  isAuroraVeil: 'Aurora Veil',
  isHelpingHand: 'Helping Hand',
  isFriendGuard: 'Friend Guard',
  isTailwind: 'Tailwind',
  isFlowerGift: 'Flower Gift',
  isBattery: 'Battery',
}

export const fieldKeys: Partial<Record<keyof State.Field, string>> = {
  isMagicRoom: 'Magic Room',
  isWonderRoom: 'Wonder Room', 
  isGravity: 'Gravity',
  isAuraBreak: 'Aura Break',
  isFairyAura: 'Fairy Aura',
  isDarkAura: 'Dark Aura',
  isBeadsOfRuin: 'Beads of Ruin',
  isSwordOfRuin: 'Sword of Ruin',
  isTabletsOfRuin: 'Tablets of Ruin',
  isVesselOfRuin: 'Vessel of Ruin',
}

export function DamageCalc({ calcId }: { calcId: CalcId }) {
  const calc = useCalc(calcId);
  const { updateCalc } = useCalcActions();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!calc) return;

  const contextValue = {
    calc,
    updateSet: (side: "attacker" | "defender", setId: SetId) => {
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
    updateStatBoosts: (side: "attacker" | "defender", patch: Partial<Record<StatName, number>>) => {
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
    updateSideConditions: (side: "attacker" | "defender", patch: Partial<State.Side>) => {
      const sideKey = side + "Side" as "attackerSide" | "defenderSide"
      updateCalc(calcId, {
        field: {
          ...calc.field,
          [sideKey]: {
            ...calc.field?.[sideKey],
            ...patch
          }
        }
      });
    },
    updateFieldConditions: (patch: Partial<State.Field>) => {
      updateCalc(calcId, {
        field: {
          ...calc.field,
          ...patch
        }
      })
    },
    getSideConditions: (side: "attacker" | "defender") => {
      const sideKey = side + "Side" as "attackerSide" | "defenderSide"
      return Object.entries(calc.field?.[sideKey] ?? {})
        .map(([key, value]) => {
          if (!value) return;
          if (key === 'spikes') return `${value} Spikes`;
          if (key === 'isSwitching') return `Switching ${value}`;
          return sideKeys[key as keyof State.Side]
        })
        .filter(Boolean)
    },
    getFieldConditions: () => {
      const { attackerSide, defenderSide, ...field } = calc.field ?? {};
      return Object.entries(field)
        .map(([key, value]) => {
          if (!value || key === 'defenderSide' || key === 'attackerSide') return;
          if (key === 'weather') return value;
          if (key === 'terrain') return `${value} Terrain`
          return fieldKeys[key as keyof State.Field]
        })
        .filter(Boolean);
    },
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
          <div className="-mx-[2px] p-1 grid grid-cols-[1fr_auto_1fr] gap-1 rounded bg-white shadow">
            <SetDropdown side="attacker" />
            <MoveDropdown setId={calc.attacker.setId} move={calc.move} onMoveChange={(move) => contextValue.updateMove(move)} />
            <SetDropdown side="defender" />
          </div>
          <FieldChips />
        </div>
        { isOpen && (
          <div className="bg-gray-100 flex justify-between">
            <StatBoosts side="attacker" />
            <div className="flex justify-between gap-1 p-1">
              <SideConditions side="attacker" />
              <FieldConditions />
              <SideConditions side="defender" />
            </div>
            <StatBoosts side="defender" />
          </div>
        )}
        <Result />
      </div>
    </DamageCalcContext.Provider>
  )
}
