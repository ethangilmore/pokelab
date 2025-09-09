import StatBars from "./StatBars";
import type { SetId } from "@/types/PokemonSet";
import { getBaseStats, getSpriteURL } from "@/utils/dex";
import { useSet, useSetActions } from "@/hooks/useStore";

interface PokemonCardProps {
  setId: SetId;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ setId }) => {
  const set = useSet(setId);
  const { removeSet, updateSetIvs, updateSetEvs } = useSetActions();

  if (!set) return;

  return (
    <div className="flex mt-4 p-2 h-[200px] border rounded shadow">
      <div className="aspect-square p-4">
        <img
          src={getSpriteURL(set.species)}
          alt={set.species}
          className="h-full aspect-square object-contain"
        />
      </div>

      <div className="flex-[3]">
        <StatBars
          baseStats={getBaseStats(set.species)}
          ivs={set.ivs}
          onIvsChange={(ivs) => {
            updateSetIvs(setId, ivs);
          }}
          evs={set.evs}
          onEvsChange={(evs) => {
            updateSetEvs(setId, evs);
          }}
        />
      </div>
      <button onClick={() => removeSet(setId)}>delete</button>
    </div>
  );
};
