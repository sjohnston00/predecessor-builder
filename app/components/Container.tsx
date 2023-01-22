import React from "react";

export default function Container({
  children,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div className='px-1 max-w-2xl m-auto' {...props}>
      {children}
    </div>
  );
}
