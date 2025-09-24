import { getLearnSet } from "@/utils/dex";
import { Dropdown } from "@/components/Dropdown";
import { useSet } from "@/hooks/useStore";
import { useDamageCalc } from "./Context";

export function MoveDropdown() {
  const { calc, updateMove } = useDamageCalc();
  const set = useSet(calc.attacker.setId);

  return (
    <Dropdown.Provider>
      <Dropdown.Button className="rounded border">
        {calc.move ?? "Choose Move"}
      </Dropdown.Button>
      <Dropdown.Content>
        <Dropdown.SearchBar />
        <Dropdown.Section label="From Set">
          { set && set.moves.map((move) => (
            <Dropdown.Item
              searchTerm={move}
              onClick={() => updateMove(move)}
            >
              {move}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
        <Dropdown.Section label="Legal Moves">
          { set && getLearnSet(set.species).filter(move => !set.moves.includes(move)).map((move) => (
            <Dropdown.Item
              searchTerm={move}
              onClick={() => updateMove(move)}
            >
              {move}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown.Provider>
  )
}
