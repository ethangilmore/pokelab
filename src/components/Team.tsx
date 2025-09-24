import { useSelectedTeam } from "@/hooks/useStore";
import { useState } from "react"
import { PokemonSet } from "@/components/PokemonSet";

export function Team() {
  const team = useSelectedTeam();
  const [selectedSet, setSelectedSet] = useState<string>(team?.sets[0] ?? "");

  if (!team) return;

  return (
    <div className="my-4">
      <div className="flex">
        {team.sets.map((id, idx) => (
          <button
            className={`${id === selectedSet && 'bg-gray-100'} size-14 rounded-t border-t border-x`}
            key={id}
            onClick={() => setSelectedSet(id)}
          >
            {idx+1}
          </button>
        ))}
      </div>
      <div className="bg-gray-100">
        <PokemonSet setId={selectedSet}/>
      </div>
    </div>
  )
}
