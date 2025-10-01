import React, { cloneElement, isValidElement, useMemo, useRef } from "react";
import { useDropdownContext } from "./DropdownContext";
import { DropdownItem, type DropdownItemProps } from "./DropdownItem";
import { DropdownSection, type DropdownSectionProps } from "./DropdownSection";
import { DropdownSearchBar } from "./DropdownSearchBar";
import { createPortal } from "react-dom";

type ContentProps = React.ComponentProps<"div">;

export const DropdownContent = ({ children, className, ...props }: ContentProps) => {
  const { isOpen, searchQuery, button } = useDropdownContext();
  const panelRef = useRef<HTMLDivElement>(null);


  const filterChildren = (kids: React.ReactNode, query: string): React.ReactNode[] => {
    // if (!query) return React.Children.toArray(kids);
    const filtered: React.ReactNode[] = [];
    React.Children.forEach(kids, (child) => {
      if (isValidElement(child)) {
        if (child.type === DropdownSearchBar) {
          filtered.push(child);
        } else if (child.type === DropdownItem) {
          const p = child.props as DropdownItemProps;
          if (!query || p.searchTerm?.toLowerCase().startsWith(query.toLowerCase())) filtered.push(child);
        } else if (child.type === DropdownSection) {
          const p = child.props as DropdownSectionProps;
          const inner = filterChildren(p.children, query);
          if (inner.length) filtered.push(cloneElement(child, p, inner));
        }
      }
    });
    return filtered;
  };

  const filteredChildren = useMemo(() => filterChildren(children, searchQuery), [children, searchQuery]);

  if (!button) return null;

  return (
    createPortal(
      <div
        ref={panelRef}
        className={`absolute left-0 min-w-full top-full mt-1 z-50 overflow-y-scroll max-h-[32rem] bg-primary border rounded shadow ${className}`}
        hidden={!isOpen}
        {...props}
      >
        {filteredChildren}
      </div>
    , button)
  );
};
