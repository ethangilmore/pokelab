import React, { useState } from "react";
import { Context } from "./Context";

type BaseProps = React.ComponentProps<typeof Context.Provider>
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
    <Context.Provider value={contextValue} {...props}>
        {children}
    </Context.Provider>
  );
}
