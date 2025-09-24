import React, { cloneElement, isValidElement, useMemo, useRef } from "react";
import { useDropdown } from "./Context";
import { Item, type ItemProps } from "./Item";
import { Section, type SectionProps } from "./Section";
import { SearchBar } from "./SearchBar";
import { createPortal } from "react-dom";

type ContentProps = React.ComponentProps<"div">;

export const Content = ({ children, className, ...props }: ContentProps) => {
  const { isOpen, searchQuery, button } = useDropdown();
  const panelRef = useRef<HTMLDivElement>(null);


  const filterChildren = (kids: React.ReactNode, query: string): React.ReactNode[] => {
    // if (!query) return React.Children.toArray(kids);
    const filtered: React.ReactNode[] = [];
    React.Children.forEach(kids, (child) => {
      if (isValidElement(child)) {
        if (child.type === SearchBar) {
          filtered.push(child);
        } else if (child.type === Item) {
          const p = child.props as ItemProps;
          if (!query || p.searchTerm?.toLowerCase().startsWith(query.toLowerCase())) filtered.push(child);
        } else if (child.type === Section) {
          const p = child.props as SectionProps;
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
        className={`absolute left-0 min-w-full top-full mt-1 z-50 overflow-y-scroll max-h-[32rem] bg-white border rounded shadow ${className}`}
        hidden={!isOpen}
        {...props}
      >
        {isOpen && filteredChildren}
      </div>
    , button)
  );
};
