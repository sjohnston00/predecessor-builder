import React from "react";

type HeadingProps = {
  type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export default function Heading({ type = "h1", ...props }: HeadingProps) {
  const { className } = props;
  switch (type) {
    case "h1":
      return (
        <h1
          {...props}
          className={`text-5xl font-bold tracking-wide ${className}`}
        />
      );
    case "h2":
      return (
        <h2
          {...props}
          className={`text-4xl font-bold tracking-wide ${className}`}
        />
      );
    case "h3":
      return (
        <h3
          {...props}
          className={`text-3xl font-bold tracking-wide ${className}`}
        />
      );
    case "h4":
      return (
        <h4
          {...props}
          className={`text-2xl font-bold tracking-wide ${className}`}
        />
      );
    case "h5":
      return (
        <h5
          {...props}
          className={`text-xl font-bold tracking-wide ${className}`}
        />
      );
    case "h6":
      return (
        <h6
          {...props}
          className={`text-lg font-bold tracking-wide ${className}`}
        />
      );
    default:
      return (
        <h1
          {...props}
          className={`text-5xl font-bold tracking-wide ${className}`}
        />
      );
  }
}
