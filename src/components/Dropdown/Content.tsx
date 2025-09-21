import React, { cloneElement, isValidElement, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useDropdown } from "./Context";
import { Item, type ItemProps } from "./Item";
import { Section, type SectionProps } from "./Section";
import { SearchBar } from "./SearchBar";

type ContentProps = React.ComponentProps<"div">;

export const Content = ({ children, className, ...props }: ContentProps) => {
  const { isOpen, setIsOpen, searchQuery, setSearchQuery, buttonRef } = useDropdown();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setSearchQuery("");
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen, setSearchQuery, buttonRef]);

  const positionPanel = () => {
    if (!isOpen || !panelRef.current || !buttonRef.current) return;
    const button = buttonRef.current.getBoundingClientRect();
    const panel = panelRef.current;

    panel.style.position = "fixed";
    panel.style.top = `${Math.round(button.bottom)}px`;
    panel.style.left = `${Math.round(button.left)}px`;
    panel.style.minWidth = `${Math.round(button.width)}px`;

    const rightOverflow = button.left + panel.offsetWidth - window.innerWidth + 24;
    if (rightOverflow > 0) {
      panel.style.left = `${Math.max(8, button.left - rightOverflow)}px`;
    }
  };

  useLayoutEffect(() => {
    positionPanel();
  }, [isOpen]);

  useEffect(() => {
    const rerender = () => positionPanel();
    window.addEventListener("resize", rerender);
    window.addEventListener("scroll", rerender, true);
    return () => {
      window.removeEventListener("resize", rerender);
      window.removeEventListener("scroll", rerender, true);
    };
  }, [isOpen]);

  const filterChildren = (kids: React.ReactNode, query: string): React.ReactNode[] => {
    if (!query) return React.Children.toArray(kids);
    const filtered: React.ReactNode[] = [];
    React.Children.forEach(kids, (child) => {
      if (isValidElement(child)) {
        if (child.type === SearchBar) {
          filtered.push(child);
        } else if (child.type === Item) {
          const p = child.props as ItemProps;
          if (p.searchTerm?.toLowerCase().startsWith(query.toLowerCase())) filtered.push(child);
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

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={`fixed mt-1 overflow-y-scroll max-h-[32rem] bg-white border rounded shadow ${className}`}
      {...props}
    >
      {filteredChildren}
    </div>
  );
};
