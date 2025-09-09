import fuzzysort from "fuzzysort";
import { Children, createContext, isValidElement, useContext, useEffect, useMemo, useRef, useState, type ComponentProps, type MouseEventHandler, type PropsWithChildren, type ReactNode } from "react"

interface DropdownContextType {
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  sectionIndent: number,
  searchQuery: string,
  setSearchQuery: (query: string) => void,
}

const DropdownContext = createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: () => {},
  sectionIndent: 0,
  searchQuery: "",
  setSearchQuery: () => {}
});

type DropdownProps = ComponentProps<'div'>;

const Dropdown = ({ children, className, ...props }: PropsWithChildren<DropdownProps>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setSearchQuery("");
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen, searchQuery, setSearchQuery, sectionIndent: 0 }}>
      <div className={`inline-block ${className}`} ref={contentRef} {...props}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

type DropdownTargetProps = ComponentProps<'button'>;

Dropdown.Target = ({ onClick, children, className, ...props }: DropdownTargetProps) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (props.disabled) return;
    onClick?.(e);
    setIsOpen(!isOpen);
  }

  return (
    <button onClick={handleClick} className={`py-1 px-2 rounded border ${className}`} {...props}>
      {children}
    </button>
  )
}

type DropdownContentProps = ComponentProps<'div'>;

Dropdown.Content = ({ children, className, ...props }: DropdownContentProps) => {
  const { isOpen } = useContext(DropdownContext);

  if (!isOpen) return;

  return (
    <div className={`overflow-y-scroll absolute mt-1 z-50 bg-white border rounded shadow ${className}`} {...props}>
      {children}
    </div>
  )
}

type DropdownSearchProps = ComponentProps<'input'>;

Dropdown.Search = (props: DropdownSearchProps) => {
  const { searchQuery, setSearchQuery } = useContext(DropdownContext);

  return (
    <div className="sticky bg-white top-0 pt-2 pb-1 px-2">
      <input
        autoFocus
        className="w-full rounded border py-1 px-2"
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        {...props}
      />
    </div>
  )
}

type DropdownSectionProps = ComponentProps<'div'> & {
  searchable?: boolean;
  label: string;
};

Dropdown.Section = ({ searchable, label, children, className, ...props }: DropdownSectionProps) => {
  const { sectionIndent, ...context } = useContext(DropdownContext);

  // TODO: make this work with nested sections
  const items: any[] = useMemo(() => {
    const childrenArray = Children.toArray(children);
    if (!searchable || !context.searchQuery) return childrenArray;
    
    const items: any[] = [];
    childrenArray.forEach((child) => {
      if (!isValidElement(child)) return;
      if (child.type === Dropdown.Item) {
        const { searchTerm } = child.props as DropdownItemProps;
        if (!searchTerm) return;
        items.push({ searchTerm, element: child});
      }
    })

    const results = fuzzysort.go(
      context.searchQuery,
      items,
      { key: "searchTerm" }
    )

    return results.map((result) => result.obj.element);
  }, [children, context.searchQuery]);

  if (!items.length) return;

  return (
    <DropdownContext.Provider value={{ ...context, sectionIndent: sectionIndent+1 }}>
      <div style={{ paddingLeft: sectionIndent*16 + 8 }} className={`py-1 px-2 font-bold ${className}`} {...props}>{label}</div>
      {items as ReactNode}
    </DropdownContext.Provider>
  )
}

type DropdownItemProps = ComponentProps<'button'> & {
  searchTerm?: string
};

Dropdown.Item = ({ onClick, children, className, searchTerm, ...props }: DropdownItemProps) => {
  const { isOpen, setIsOpen, sectionIndent, setSearchQuery } = useContext(DropdownContext);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (props.disabled) return;
    onClick?.(e);
    setSearchQuery("");
    setIsOpen(!isOpen);
  }

  return (
    <button style={{ paddingLeft: sectionIndent*16 + 8 }} className={`w-full text-left py-1 hover:bg-gray-100 ${className}`}onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

export { Dropdown };
