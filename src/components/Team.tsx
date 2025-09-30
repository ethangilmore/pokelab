import { useSelectedTeam, useSet } from "@/hooks/useStore";
import { useState } from "react"
import { PokemonSet } from "@/components/PokemonSet";
import type { SetId } from "@/types/PokemonSet";
import { getSpriteURL } from "@/utils/dex";

function SetTab({ setId }: { setId: SetId }) {
  const set = useSet(setId);

  if (!set) return;

  return (
    <img className="size-full p-1" src={getSpriteURL(set.species)} />
  );
}

export function Team() {
  const team = useSelectedTeam();
  const [selectedSet, setSelectedSet] = useState<string>(team?.sets[0] ?? "");

  if (!team) return;

  return (
    <div className="my-2">
      <div className="flex">
        {team.sets.map(id => (
          <button
            className={`${id === selectedSet && 'bg-gray-100'} size-14 rounded-t border-t border-x`}
            key={id}
            onClick={() => setSelectedSet(id)}
          >
            <SetTab setId={id} />
          </button>
        ))}
      </div>
      <div className="bg-gray-100">
        <PokemonSet setId={selectedSet}/>
      </div>
    </div>
  )
}
