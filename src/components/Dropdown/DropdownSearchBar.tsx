import React, { useEffect, useRef } from "react";
import { useDropdownContext } from "./DropdownContext";


type DropdownSearchBarProps = React.ComponentProps<'input'>;

export const DropdownSearchBar = (props: DropdownSearchBarProps) => {
  const { searchQuery, setSearchQuery, isOpen } = useDropdownContext();

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) ref.current?.focus();
  }, [isOpen])


  return (
    <div className="sticky m-1">
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

