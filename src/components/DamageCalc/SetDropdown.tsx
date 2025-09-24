import React from "react";
import { Dropdown } from "@/components/Dropdown";
import { importSets } from "@/utils/serialization";
import { getSpriteURL } from "@/utils/dex";
import { useSetActions, useSet, useSelectedTeam, useTeamSetInfo } from "@/hooks/useStore";
import { useDamageCalc } from "./Context";

type SetDropdownProps = {
  side: "attacker" | "defender";
}

export function SetDropdown({ side }: SetDropdownProps) {
  const { calc, updateSet } = useDamageCalc();
  const { addSet } = useSetActions();
  const set = useSet(calc[side].setId);
  const selectedTeam = useSelectedTeam();
  const teamSetsInfo = useTeamSetInfo(selectedTeam?.id);
  const librarySetsInfo = useTeamSetInfo(undefined);

  return (
    <Dropdown.Provider>
      <Dropdown.Button className="rounded border">
        { set ? (
        <div className="m-1 flex gap-1 items-center">
          <img className="shrink-0 inline h-8 sm:h-10 md:h-12" src={getSpriteURL(set.species)}/>
          <span className="truncate">{set.species}</span>
        </div>
        ) : "Choose Set"}
      </Dropdown.Button>
      <Dropdown.Content>
        <Dropdown.SearchBar />
        <Dropdown.Section label="New Set">
          <Dropdown.Item 
            onClick={async () => {
              const data = await navigator.clipboard.readText();
              importSets(data).forEach((set) => addSet(set));
            }}
          >
            Copy from clipboard
          </Dropdown.Item>
        </Dropdown.Section>
        <Dropdown.Section label="From Team" searchable>
          {Object.entries(teamSetsInfo).map(([setId, name]) => (
            <Dropdown.Item
              key={setId}
              searchTerm={name}
              onClick={() => updateSet(side, setId)}
            >
              {name as React.ReactNode}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
        <Dropdown.Section label="From Library" searchable>
          {Object.entries(librarySetsInfo).map(([setId, name]) => (
            <Dropdown.Item
              key={setId}
              searchTerm={name}
              onClick={() => updateSet(side, setId)}
            >
              {name as React.ReactNode}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown.Provider>
  )
}
