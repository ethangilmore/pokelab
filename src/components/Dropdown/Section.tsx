import React from "react";
import { Provider } from "./Provider";
import { useDropdownContext } from "./Context";

export type SectionProps = React.ComponentProps<'div'> & {
  searchable?: boolean;
  label?: string;
};

export const Section = ({ searchable, label, children, className, ...props }: SectionProps) => {
  const { sectionIndent, ...context } = useDropdownContext();

  return (
    <Provider value={{ ...context, sectionIndent: sectionIndent+1 }}>
      <div style={{ paddingLeft: sectionIndent*16 + 8 }} className={`py-1 px-2 font-bold w-full ${className}`} {...props}>{label}</div>
      {children}
    </Provider>
  )
}
