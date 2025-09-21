type SideConditionsProps = {
  side: "attackerSide" | "defenderSide";
}

export function SideConditions({ } : SideConditionsProps) {
  return (
    <div className="bg-white flex flex-col rounded border divide-y">
      <button className="px-1">Helping Hand</button> 
      <button className="px-1">Aurora Veil</button> 
      <button className="px-1">Reflect</button> 
      <button className="px-1">Light Screen</button> 
      <button className="px-1">Friend Guard</button> 
      <button className="px-1">Tailwind</button> 
      <button className="px-1">Flower Gift</button> 
      <button className="px-1">Battery</button> 
      <button className="px-1">Switching Out</button> 
    </div>
  )
}
