import { useSelectedTeam, useSet } from "@/hooks/useStore";
import { useState } from "react"
import { PokemonSet } from "@/components/PokemonSet";
import type { SetId } from "@/types/PokemonSet";
import { getSpriteURL } from "@/utils/dex";
import { Button } from "./Button";

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
          <Button
            className={`${id === selectedSet && 'bg-secondary'} size-14 rounded border rounded-b-none border-b-0`}
            key={id}
            onClick={() => setSelectedSet(id)}
          >
            <SetTab setId={id} />
          </Button>
        ))}
      </div>
      <PokemonSet setId={selectedSet}/>
    </div>
  )
}
