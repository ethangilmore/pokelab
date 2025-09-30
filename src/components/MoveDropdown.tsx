import { Dex } from "@pkmn/dex";
import { Dropdown } from "./Dropdown";
import { useEffect, useState } from "react";
import { useSet } from "@/hooks/useStore";
import { getLearnSet } from "@/utils/dex";

const colors = {
	Normal: 'border-[#A8A77A] bg-[#A8A77A]/50',
	Fire: 'border-[#EE8130] bg-[#EE8130]/50',
	Water: 'border-[#6390F0] bg-[#6390F0]/50',
	Electric: 'border-[#F7D02C] bg-[#F7D02C/50]',
	Grass: 'border-[#7AC74C] bg-[#7AC74C]/50',
	Ice: 'border-[#96D9D6] bg-[#96D9D6]/50',
	Fighting: 'border-[#C22E28] bg-[#C22E28]/50',
	Poison: 'border-[#A33EA1] bg-[#A33EA1]/50',
	Ground: 'border-[#E2BF65] bg-[#E2BF65]/50',
	Flying: 'border-[#A98FF3] bg-[#A98FF3]/50',
	Psychic: 'border-[#F95587] bg-[#F95587]/50',
	Bug: 'border-[#A6B91A] bg-[#A6B91A]/50',
	Rock: 'border-[#B6A136] bg-[#B6A136]/50',
	Ghost: 'border-[#735797] bg-[#735797]/50',
	Dragon: 'border-[#6F35FC] bg-[#6F35FC]/50',
	Dark: 'border-[#705746] bg-[#705746]/50',
	Steel: 'border-[#B7B7CE] bg-[#B7B7CE]/50',
	Fairy: 'border-[#D685AD] bg-[#D685AD]/50',
};

type MoveDropdownProps = {
  setId?: string;
  move?: string;
  onMoveChange: (move: string) => void;
}

export function MoveDropdown({ setId, move, onMoveChange }: MoveDropdownProps) {
  const set = useSet(setId);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [learnset, setLearnset] = useState([""]);

  useEffect(() => {
    if (!set) return;
    const learnset = getLearnSet(set.species).filter(move => !set.moves.includes(move)) 
    setLearnset(learnset);
  }, [setId]);

  useEffect(() => {
    const moveData = Dex.moves.get(move ?? "");
    setType(moveData.type);
    setCategory(moveData.category);
  }, [move]);
  
  return (
    <Dropdown.Provider>
      <Dropdown.Button className={`flex items-center justify-between px-1 gap-1 rounded border-2 bg-white ${colors[(type as keyof typeof colors)]}`}>
        {move ? (
          <>
            <img style={{ imageRendering: "pixelated"}} className="h-[1em] right-0" src={`https://play.pokemonshowdown.com/sprites/categories/${category}.png`} />
            <div className="truncate">{move}</div>
            <img style={{ imageRendering: "pixelated"}} className="h-[1em] right-0" src={`https://play.pokemonshowdown.com/sprites/types/${type}.png`} />
          </>
        ) : (
          <span>Select Move...</span>
        )}
      </Dropdown.Button>
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
          { set && learnset.map((move) => (
            <Dropdown.Item
              key={move}
              searchTerm={move}
              onClick={() => onMoveChange(move)}
            >
              {move}
            </Dropdown.Item>
          ))}
        </Dropdown.Section>
      </Dropdown.Content>
    </Dropdown.Provider>
  );
}
