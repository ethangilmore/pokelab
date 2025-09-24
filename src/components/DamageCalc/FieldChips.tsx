import { useDamageCalc } from "./Context"

export function FieldChips() {
 const { isOpen, getFieldConditions } = useDamageCalc();

  return (
    <div className="p-1 empty:p-0 empty:h-1 text-xs md:text-sm flex gap-1 justify-center overflow-x-hidden">
      {isOpen && <div className="text-transparent py-1 max-w-0">.</div>}
      {getFieldConditions().map((condition) => (
        <div key={condition} className="bg-white py-1 px-2 rounded align-middle  min-w-max">{condition}</div>
      ))}
      {isOpen && <div className="text-transparent py-1 max-w-0">.</div>}
    </div>
  )
}
