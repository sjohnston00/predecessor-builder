import React from "react"

export default function Container({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div className={`px-1 max-w-2xl m-auto ${className}`} {...props}>
      {children}
    </div>
  )
}
