import type { State } from "@smogon/calc";
import { useDamageCalc } from "./Context";
import { sideKeys } from "./DamageCalc";

type SideConditionsProps = {
  side: "attacker" | "defender";
}

export function SideConditions({ side } : SideConditionsProps) {
  const { calc: { field }, updateSideConditions } = useDamageCalc();
  const sideKey = side + "Side" as "attackerSide" | "defenderSide";


  const toggleCondition = (condition: keyof State.Side) => {
    return () => {
      updateSideConditions(side, {
        [condition]: !field?.[sideKey]?.[condition]
      })
    }
  }

  const conditions: (keyof State.Side)[] = ['isHelpingHand', 'isAuroraVeil', 'isReflect', 'isLightScreen', 'isFriendGuard', 'isTailwind', 'isFlowerGift', 'isBattery']

  return (
    <div className="bg-white flex flex-col rounded border divide-y">
      {conditions.map((condition) => (
        <button
        key={condition}
        className={`px-1 ${field?.[sideKey]?.[condition] && 'bg-gray-200'}`}
        onClick={toggleCondition(condition)}>
          {sideKeys[condition]}
        </button>
      ))}
    </div>
  )
}
