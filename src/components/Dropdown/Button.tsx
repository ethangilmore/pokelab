import React from "react";
import { useDropdownContext } from "./Context";

type DropdownTargetProps = React.ComponentProps<'button'>;

export const Button = ({ onClick, children, ...props }: DropdownTargetProps) => {
  const { isOpen, setIsOpen, setSearchQuery, buttonRef } = useDropdownContext();

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
