import { createContext, useContext } from "react";

type DropdownContext = {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  searchQuery: string,
  setSearchQuery: (query: string) => void,
  sectionIndent: number,
  setButton: (button: HTMLButtonElement | null) => void,
  button: HTMLButtonElement | null,
}

export const DropdownContext = createContext<DropdownContext | null>(null);

export const useDropdown = () => {
  const context =  useContext(DropdownContext);
  if (!context) throw new Error("Using Dropdown Context outside of Dropdown Provider");
  return context;
}

