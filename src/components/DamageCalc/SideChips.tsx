import React from "react";
import { useDamageCalc } from "./Context";

type SideChipsProps = React.ComponentProps<'div'> & {
  side: "attacker" | "defender";
}

export function SideChips({ side, className, ...props }: SideChipsProps) {
  const { calc, isOpen, getSideConditions } = useDamageCalc();

  return (
    <div className={`p-1 empty:p-0 empty:h-1 flex flex-row gap-1 ${className}`} {...props}>
      {Object.entries(calc[side].boosts ?? {}).filter(([_, value]) => value).map(([stat, value]) => (
        <div key={stat} className="bg-white md:px-2 rounded align-middle p-1 min-w-max">
        {stat.charAt(0).toUpperCase() + stat.slice(1)} {Intl.NumberFormat('en-us', { signDisplay: 'always' }).format(Number(value))}
        </div>
      ))}
      {getSideConditions(side).map((condition) => (
        <div key={condition} className="bg-white md:px-2 rounded align-middle p-1 min-w-max">
          {condition}
        </div>
      ))}
      {isOpen && <div className="text-transparent px-2 py-1">+</div>}
    </div>
  )
}
