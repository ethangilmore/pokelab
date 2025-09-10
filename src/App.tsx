import { useCalcActions, useSelectedTeam, useSetActions, useTeamActions } from "@/hooks/useStore";
import { getDefaultSet } from "@/utils/dex";
import { PokemonCard } from "./components/PokemonCard";
import { importSets } from "./utils/serialization";
import { DamageCalc } from "./components/DamageCalc";

import { Dropdown } from "./components/Dropdown";
import { Dex } from "@pkmn/dex";

function App() {
  const selectedTeam = useSelectedTeam();
  const { addSet } = useSetActions();
  const { addTeam, selectTeam } = useTeamActions();
  const { addCalc } = useCalcActions();

  return (
    <div className="p-2">
      <button
        className="py-1 px-2 mb-4 rounded border"
        onClick={async () => {
          const teamId = addTeam("New Team");
          selectTeam(teamId);
        }}
      >
        Add Team +
      </button>
      { selectedTeam && (
        <div>
          <Dropdown className="rounded border py-1 px-2">
            <Dropdown.Target>
              Add Pokemon +
            </Dropdown.Target>
            <Dropdown.Content className="max-h-[512pt]">
              <Dropdown.Search />
              <Dropdown.Section label="Import Set" searchable>
                <Dropdown.Item 
                  onClick={async () => {
                    const data = await navigator.clipboard.readText();
                    importSets(data).forEach((set) => addSet(set, selectedTeam.id));
                  }}
                >
                  Copy from clipboard
                </Dropdown.Item>
              </Dropdown.Section>
              <Dropdown.Section label="Add Pokemon" searchable>
              {Dex.species.all().map((species) => (
                <Dropdown.Item
                  searchTerm={species.name}
                  onClick={() => {
                    addSet(getDefaultSet(species.id), selectedTeam.id);
                  }}
                >
                  {species.name}
                </Dropdown.Item>
              ))}
              </Dropdown.Section>
            </Dropdown.Content>
          </Dropdown>
          <button
            className="py-1 px-2 mx-2 rounded border"
            onClick={async () => {
              if (selectedTeam) addCalc({}, selectedTeam.id)
            }}
          >
            Add Calc +
          </button>

          {selectedTeam.sets.map((setId) => (
            <PokemonCard key={setId} setId={setId} />
          ))}

          {selectedTeam.calcs.map((calcId) => (
            <DamageCalc key={calcId} calcId={calcId} />
          ))}

          {/*<CoverageChart />*/}
          {/*<SpeedChart />*/}
        </div>
      )}
    </div>
  );
}

export default App;
