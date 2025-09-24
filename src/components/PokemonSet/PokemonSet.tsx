import type { SetId } from "@/types/PokemonSet";
import { getSpriteURL } from "@/utils/dex";
import { useSet, useSetActions } from "@/hooks/useStore";
import { PokemonSetContext } from "./Context";
import type { PokemonSet } from "@pkmn/dex";
import type { StatName } from "@/types/Stats";
import { StatRow } from "./StatRow";
import { Dropdown } from "@/components/Dropdown";

export function MockDropdown({ children }: { children: React.ReactNode }) {
  return (
    <Dropdown.Provider>
      <Dropdown.Button className="p-1 bg-white rounded border">
        {children}
      </Dropdown.Button>
    </Dropdown.Provider>
  )
}

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
      <div className="text-xs sm:text-sm md:text-base p-1 grid grid-cols-[auto_1fr_1fr_1fr] gap-1 border rounded shadow">
        <img
          className="max-w-24 flex flex-col justify-center pr-1 my-auto"
          src={getSpriteURL(set.species)}
          alt={set.species}
        />

        <div className="col-span-3 grid grid-cols-[auto_2fr_auto_1fr_auto_auto] gap-y-px gap-x-1">
          {(["hp", "atk", "spa", "def", "spd", "spe"] as StatName[]).map((stat) => (
            <StatRow key={stat} stat={stat} />
          ))}
        </div>

        <div className="row-span-2 grid grid-rows-subgrid gap-px">
          <MockDropdown>{set.species ?? "Select Species"}</MockDropdown>
        </div>
        <div className="row-span-2 grid grid-rows-subgrid gap-px">
          <MockDropdown>{set.ability}</MockDropdown>
          <MockDropdown>{set.item ?? "Select Item"}</MockDropdown>
        </div>
        <div className="row-span-2 col-span-2 grid grid-rows-subgrid grid-cols-subgrid gap-px">
          {Array.from({ length: 4 }, (_, idx) => (
            <MockDropdown key={idx}>
              Select Move
            </MockDropdown>
          ))}
        </div>

      </div>
    </PokemonSetContext.Provider>
  );
}
