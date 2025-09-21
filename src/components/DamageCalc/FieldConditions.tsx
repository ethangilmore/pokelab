export function FieldConditions() {
  return (
    <div className="flex flex-col gap-1"> 
      <div className="bg-white flex flex-col rounded border divide-y">
        <button className="px-1">Sun</button> 
        <button className="px-1">Rain</button> 
        <button className="px-1">Sand</button> 
        <button className="px-1">Snow</button> 
      </div>
      <div className="bg-white flex flex-col rounded border divide-y">
        <button className="px-1">Electric</button> 
        <button className="px-1">Misty</button> 
        <button className="px-1">Grassy</button> 
        <button className="px-1">Psychic Terrain</button> 
      </div>
      <div className="bg-white flex flex-col rounded border divide-y">
        <button className="px-1">Tablets</button> 
        <button className="px-1">Beads</button> 
        <button className="px-1">Sword</button> 
        <button className="px-1">Vessel of Ruin</button> 
      </div>
    </div>
  )
}
