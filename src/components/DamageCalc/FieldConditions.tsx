import type { Terrain, Weather } from "@smogon/calc/dist/data/interface";
import { useDamageCalc } from "./Context"
import type { State } from "@smogon/calc";

export function FieldConditions() {
  const { calc, updateFieldConditions } = useDamageCalc();

  const toggleWeather = (weather: Weather) => {
    return () => {
      updateFieldConditions({ weather: calc.field?.weather === weather ? undefined : weather });
    }
  }

  const toggleTerrain = (terrain: Terrain) => {
    return () => {
      updateFieldConditions({ terrain: calc.field?.terrain === terrain ? undefined : terrain });
    }
  }

  const toggleEffect = (key: keyof State.Field) => {
    return () => {
      updateFieldConditions({ [key]: !calc.field?.[key] })
    }
  }

  const weathers: Weather[] = ["Sun", "Rain", "Snow", "Sand"]
  const terrains: Terrain[] = ["Electric", "Misty", "Grassy", "Psychic"]

  return (
    <div className="flex flex-col gap-1"> 
      <div className="bg-white flex flex-col rounded border divide-y">
        {weathers.map((weather) => (
          <button key={weather} className={`px-1 ${calc.field?.weather === weather && 'bg-gray-200'}`} onClick={toggleWeather(weather)}>
            {weather}
          </button> 
        ))}
      </div>
      <div className="bg-white flex flex-col rounded border divide-y">
        {terrains.map((terrain, idx) => (
          <button key={terrain} className={`px-1 ${calc.field?.terrain === terrain && 'bg-gray-200'}`} onClick={toggleTerrain(terrain)}>
            {terrain}{idx === terrains.length-1 && " Terrain"}
          </button> 
        ))}
      </div>
      <div className="bg-white flex flex-col rounded border divide-y">
        <button className={`px-1 ${calc.field?.isTabletsOfRuin && 'bg-gray-200'}`} onClick={toggleEffect("isTabletsOfRuin")}>Tablets</button> 
        <button className={`px-1 ${calc.field?.isBeadsOfRuin && 'bg-gray-200'}`} onClick={toggleEffect("isBeadsOfRuin")}>Beads</button> 
        <button className={`px-1 ${calc.field?.isSwordOfRuin && 'bg-gray-200'}`} onClick={toggleEffect("isSwordOfRuin")}>Sword</button> 
        <button className={`px-1 ${calc.field?.isVesselOfRuin && 'bg-gray-200'}`} onClick={toggleEffect("isVesselOfRuin")}>Vessel of Ruin</button> 
      </div>
    </div>
  )
}
