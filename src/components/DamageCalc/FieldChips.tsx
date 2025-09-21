import { useDamageCalc } from "./Context"

export function FieldChips() {
 const { calc, isOpen } = useDamageCalc();
 const { attackerSide, defenderSide, ...field } = calc.field ?? {};

  return (
    <div className="p-1 empty:p-0 empty:h-1 text-xs md:text-sm flex gap-1 overflow-x-hidden">
      {Object.values(field).map((effect) => (
        <div className="bg-white px-2 rounded align-middle p-1 min-w-max">{effect}</div>
      ))}
      {isOpen && <div className="text-transparent px-2 py-1">+</div>}
    </div>
  )
}
