import React, { useEffect, useRef } from "react";
import { useDropdownContext } from "./DropdownContext";
import { Button } from "../Button";

type DropdownTargetProps = React.ComponentProps<'button'>;

export const DropdownButton = ({ onClick, children, className, ...props }: DropdownTargetProps) => {
  const { isOpen, setIsOpen, button, setButton, setSearchQuery } = useDropdownContext();
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
    <Button ref={ref} onClick={handleClick} className={`relative ${className}`} {...props} >
      {children}
    </Button>
  )
}
