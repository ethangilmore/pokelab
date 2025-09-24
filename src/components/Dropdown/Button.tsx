import React, { useEffect, useRef } from "react";
import { useDropdown } from "./Context";

type DropdownTargetProps = React.ComponentProps<'button'>;

export const Button = ({ onClick, children, className, ...props }: DropdownTargetProps) => {
  const { isOpen, setIsOpen, button, setButton, setSearchQuery } = useDropdown();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setButton(ref.current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (button && !button.contains(e.target as Node)) {
        setSearchQuery("");
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen, setSearchQuery, button]);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setSearchQuery("");
    onClick?.(e);
    setIsOpen(!isOpen);
  }

  return (
    <button ref={ref} onClick={handleClick} className={`relative ${className}`} {...props} >
      {children}
    </button>
  )
}
