import { Icons } from "@pkmn/img";
import { Dropdown } from "./Dropdown";
import { useEffect, useState } from "react";
import { Dex } from "@pkmn/dex";

type ItemDropdownProps = {
  item?: string;
  onItemChange: (item: string) => void;
}

export function ItemDropdown({ item, onItemChange }: ItemDropdownProps) {

  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(Dex.items.all().map(item => item.name));
  }, []);

  return (
    <Dropdown.Provider>
      <Dropdown.Button className="rounded border">
        {item ? (
          <div className="flex justify-center items-center gap-px">
            <div style={{ ...Icons.getItem(item).css, scale: .75 }} />
            <span className="truncate">{item}</span>
          </div>
        ) : (
          "Select Item"
        )}
      </Dropdown.Button>
      <Dropdown.Content>
        <Dropdown.SearchBar />
        {items.map(item => (
          <Dropdown.Item
            searchTerm={item}
            onClick={() => onItemChange(item)}
          >
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Provider>
  )
}
