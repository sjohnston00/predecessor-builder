import React from "react"

type HeadingProps = {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>

export default function Heading({
  type = "h1",
  className = "",
  ...props
}: HeadingProps) {
  switch (type) {
    case "h1":
      return (
        <h1
          className={`text-5xl font-bold tracking-wide ${className}`}
          {...props}
        />
      )
    case "h2":
      return (
        <h2
          className={`text-4xl font-bold tracking-wide ${className}`}
          {...props}
        />
      )
    case "h3":
      return (
        <h3
          className={`text-3xl font-bold tracking-wide ${className}`}
          {...props}
        />
      )
    case "h4":
      return (
        <h4
          className={`text-2xl font-bold tracking-wide ${className}`}
          {...props}
        />
      )
    case "h5":
      return (
        <h5
          className={`text-xl font-bold tracking-wide ${className}`}
          {...props}
        />
      )
    case "h6":
      return (
        <h6
          className={`text-lg font-bold tracking-wide ${className}`}
          {...props}
        />
      )
    default:
      return (
        <h1
          className={`text-5xl font-bold tracking-wide ${className}`}
          {...props}
        />
      )
  }
}
