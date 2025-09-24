import type { SetId } from "@/types/PokemonSet";
import { getSpriteURL } from "@/utils/dex";
import { useSet, useSetActions } from "@/hooks/useStore";
import { PokemonSetContext } from "./Context";
import type { PokemonSet } from "@pkmn/dex";
import type { StatName } from "@/types/Stats";
import { StatRow } from "./StatRow";

type PokemonSetProps = {
  setId: SetId;
}

export function PokemonSet({ setId }: PokemonSetProps) {
  const set = useSet(setId);
  const { updateSet, updateSetIvs, updateSetEvs } = useSetActions();

  if (!set) return;

  const contextValue = {
    set,
    updateSet: (patch: Partial<PokemonSet>) => updateSet(set.id, patch),
    updateSetIvs: (patch: Partial<Record<StatName, number>>) => updateSetIvs(set.id, patch),
    updateSetEvs: (patch: Partial<Record<StatName, number>>) => updateSetEvs(set.id, patch)
  }

  return (
    <PokemonSetContext.Provider value={contextValue}>
      <div className="flex p-2 border rounded shadow">
        <div className="aspect-square flex flex-col justify-center pr-1">
          <img
            src={getSpriteURL(set.species)}
            alt={set.species}
            className="max-w-24"
          />
        </div>

        <div className="flex-1 grid grid-cols-[auto_1fr_auto_1fr_auto_auto] gap-x-1 gap-y-px text-xs">
          {(["hp", "atk", "spa", "def", "spd", "spe"] as StatName[]).map((stat) => (
            <StatRow stat={stat} />
          ))}
        </div>
      </div>
    </PokemonSetContext.Provider>
  );
}
