import type { State } from "@smogon/calc";
import { useDamageCalc } from "./Context";
import { sideKeys } from "./DamageCalc";
import { Button } from "../Button";

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
    <div className="flex flex-col rounded border divide-y max-h-min overflow-hidden">
      {conditions.map((condition) => (
        <Button
        key={condition}
        className={`px-1 ${field?.[sideKey]?.[condition] && 'bg-tertiary'}`}
        onClick={toggleCondition(condition)}>
          {sideKeys[condition]}
        </Button>
      ))}
    </div>
  )
}
