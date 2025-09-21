import React from "react";
import { useDropdown } from "./Context";

type DropdownTargetProps = React.ComponentProps<'button'>;

export const Button = ({ onClick, children, ...props }: DropdownTargetProps) => {
  const { isOpen, setIsOpen, setSearchQuery, buttonRef } = useDropdown();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setSearchQuery("");
    onClick?.(e);
    setIsOpen(!isOpen);
  }

  return (
    <button ref={buttonRef} onClick={handleClick} {...props}>
      {children}
    </button>
  )
}
