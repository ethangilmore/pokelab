import React from "react";
import { DropdownProvider } from "./DropdownProvider";
import { useDropdownContext } from "./DropdownContext";

export type DropdownSectionProps = React.ComponentProps<'div'> & {
  searchable?: boolean;
  label?: string;
};

export const DropdownSection = ({ searchable, label, children, className, ...props }: DropdownSectionProps) => {
  const { sectionIndent, ...context } = useDropdownContext();

  return (
    <DropdownProvider value={{ ...context, sectionIndent: sectionIndent+1 }}>
      <div style={{ paddingLeft: sectionIndent*16 + 8 }} className={`text-left py-1 px-2 font-bold w-full ${className}`} {...props}>{label}</div>
      {children}
    </DropdownProvider>
  )
}
