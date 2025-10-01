import { useCalcActions, useSelectedTeam, useSetActions, useTeamActions } from "@/hooks/useStore";
import { getDefaultSet } from "@/utils/dex";
// import { PokemonCard } from "@/components/PokemonCard";
import { importSets } from "@/utils/serialization";
import { DamageCalc } from "@/components/DamageCalc";
import { Dropdown } from "@/components/Dropdown";
import { Team } from "@/components/Team";
import { Dex } from "@pkmn/dex";
import { Button } from "./components/Button";

function App() {
  const selectedTeam = useSelectedTeam();
  const { addSet } = useSetActions();
  const { addTeam, selectTeam } = useTeamActions();
  const { addCalc } = useCalcActions();

  return (
    <div className="p-2">
      <div className="size-16 bg-primary" />
      <Button
        className="py-1 px-2 mb-2 rounded border"
        onClick={async () => {
          const teamId = addTeam("New Team");
          selectTeam(teamId);
        }}
      >
        Add Team +
      </Button>
      { selectedTeam && (
        <div className="max-w-3xl">
          <Dropdown.Provider>
            <Dropdown.Button className="rounded border py-1 px-2">
              Add Pokemon +
            </Dropdown.Button>
            <Dropdown.Content>
              <Dropdown.SearchBar />
              <Dropdown.Section label="Import Set">
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
                    addSet(getDefaultSet(species.name), selectedTeam.id);
                  }}
                >
                  {species.name}
                </Dropdown.Item>
              ))}
              </Dropdown.Section>
            </Dropdown.Content>
          </Dropdown.Provider>
          <Button
            className="py-1 px-2 mx-2 rounded border"
            onClick={async () => {
              if (selectedTeam) addCalc({attacker: {}, defender: {}}, selectedTeam.id)
            }}
          >
            Add Calc +
          </Button>

          <Team />

          {/*selectedTeam.sets.map((setId) => (
            <PokemonCard key={setId} setId={setId} />
          ))*/}

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
