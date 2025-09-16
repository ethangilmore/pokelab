import React from "react";
import { useDropdownContext } from "./Context";


export type ItemProps = React.ComponentProps<'button'> & {
  searchTerm?: string
};

export const Item = ({ onClick, children, className, searchTerm, ...props }: ItemProps) => {
  const { isOpen, setIsOpen, sectionIndent, setSearchQuery } = useDropdownContext();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (props.disabled) return;
    onClick?.(e);
    setSearchQuery("");
    setIsOpen(!isOpen);
  }

  return (
    <button style={{ paddingLeft: sectionIndent*16 + 8 }} className={`w-full min-w-max text-left py-1 pr-2 hover:bg-gray-100 ${className}`}onClick={handleClick} {...props}>
      {children}
    </button>
  )
}
