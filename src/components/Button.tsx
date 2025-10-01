import { forwardRef } from "react"


export const Button = forwardRef<HTMLButtonElement, React.ComponentProps<'button'>>(
  ({ children, className, ...props }, ref) => {
    return (
      <button ref={ref} className={`bg-button hover:bg-hover ${className}`} {...props}>
        {children}
      </button>
    )
  }
)
