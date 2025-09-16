import { getLearnSet } from "@/utils/dex";
import { Dropdown } from "@/components/Dropdown";
import { useSet } from "@/hooks/useStore";

export function MoveDropdown({ attackerId, move, onMoveChange }: { attackerId?: string, move?: string, onMoveChange: (move: string) => void }) {
  const set = useSet(attackerId);

  return (
    <Dropdown.Provider>
      <Dropdown.Button className="rounded border">{move ?? "Choose Move"}</Dropdown.Button>
      <Dropdown.Content>
        <Dropdown.SearchBar />
        <Dropdown.Section label="From Set">
          { set && set.moves.map((move) => (
            <Dropdown.Item
              searchTerm={move}
              onClick={() => onMoveChange(move)}
            >
              {move}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
        <Dropdown.Section label="Legal Moves">
          { set && getLearnSet(set.species).filter(move => !set.moves.includes(move)).map((move) => (
            <Dropdown.Item
              searchTerm={move}
              onClick={() => onMoveChange(move)}
            >
              {move}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown.Provider>
  )
}
