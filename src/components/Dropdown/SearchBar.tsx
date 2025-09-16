import React from "react";
import { useDropdownContext } from "./Context";


type DropdownSearchProps = React.ComponentProps<'input'>;

export const SearchBar = (props: DropdownSearchProps) => {
  const { searchQuery, setSearchQuery } = useDropdownContext();

  return (
    <div className="sticky bg-white m-1">
      <input
        autoFocus
        className="w-full rounded border py-1 px-2"
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        {...props}
      />
    </div>
  )
}

