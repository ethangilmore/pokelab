import React, { createContext, useContext } from "react";

type DropdownContext = {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  searchQuery: string,
  setSearchQuery: (query: string) => void,
  sectionIndent: number,
  buttonRef: React.RefObject<HTMLButtonElement | null>,
}

export const Context = createContext<DropdownContext | null>(null);

export const useDropdown = () => {
  const context =  useContext(Context);
  if (!context) throw new Error("Using Dropdown Context outside of Dropdown Provider");
  return context;
}

