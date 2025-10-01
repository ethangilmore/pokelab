import type { Terrain, Weather } from "@smogon/calc/dist/data/interface";
import { useDamageCalc } from "./Context"
import type { State } from "@smogon/calc";
import { Button } from "../Button";

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
      <div className="bg-primary flex flex-col rounded border divide-y overflow-hidden">
        {weathers.map((weather) => (
          <Button key={weather} className={`px-1 ${calc.field?.weather === weather && 'bg-tertiary'}`} onClick={toggleWeather(weather)}>
            {weather}
          </Button> 
        ))}
      </div>
      <div className="bg-white flex flex-col rounded border divide-y overflow-hidden">
        {terrains.map((terrain, idx) => (
          <Button key={terrain} className={`px-1 ${calc.field?.terrain === terrain && 'bg-tertiary'}`} onClick={toggleTerrain(terrain)}>
            {terrain}{idx === terrains.length-1 && " Terrain"}
          </Button> 
        ))}
      </div>
      <div className="bg-white flex flex-col rounded border divide-y overflow-hidden">
        <Button className={`px-1 ${calc.field?.isTabletsOfRuin && 'bg-tertiary'}`} onClick={toggleEffect("isTabletsOfRuin")}>Tablets</Button> 
        <Button className={`px-1 ${calc.field?.isBeadsOfRuin && 'bg-tertiary'}`} onClick={toggleEffect("isBeadsOfRuin")}>Beads</Button> 
        <Button className={`px-1 ${calc.field?.isSwordOfRuin && 'bg-tertiary'}`} onClick={toggleEffect("isSwordOfRuin")}>Sword</Button> 
        <Button className={`px-1 ${calc.field?.isVesselOfRuin && 'bg-tertiary'}`} onClick={toggleEffect("isVesselOfRuin")}>Vessel of Ruin</Button> 
      </div>
    </div>
  )
}
