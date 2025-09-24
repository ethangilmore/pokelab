import React, { useState } from "react";
import { DropdownContext } from "./Context";

type BaseProps = React.ComponentProps<typeof DropdownContext.Provider>
type ProviderProps = Omit<BaseProps, "value"> & { value?: BaseProps["value"] }

export const Provider = ({ children, value, ...props }: React.PropsWithChildren<ProviderProps>) => {
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
