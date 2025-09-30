import React, { useEffect, useRef } from "react";
import { useDropdown } from "./Context";


type DropdownSearchProps = React.ComponentProps<'input'>;

export const SearchBar = (props: DropdownSearchProps) => {
  const { searchQuery, setSearchQuery, isOpen } = useDropdown();

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) ref.current?.focus();
  }, [isOpen])


  return (
    <div className="sticky bg-white m-1">
      <input
        ref={ref}
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

