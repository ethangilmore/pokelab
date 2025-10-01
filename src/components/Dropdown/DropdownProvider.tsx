import React, { useState } from "react";
import { DropdownContext } from "./DropdownContext";

type BaseProps = React.ComponentProps<typeof DropdownContext.Provider>
type DropdownProviderProps = Omit<BaseProps, "value"> & { value?: BaseProps["value"] }

export const DropdownProvider = ({ children, value, ...props }: React.PropsWithChildren<DropdownProviderProps>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [button, setButton] = useState<HTMLButtonElement | null>(null);

  const contextValue = value ?? {
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    sectionIndent: 0,
    button,
    setButton,
  }

  return (
    <DropdownContext.Provider value={contextValue} {...props}>
        {children}
    </DropdownContext.Provider>
  );
}
