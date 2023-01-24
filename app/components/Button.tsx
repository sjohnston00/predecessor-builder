import React from "react";

export default function Button({
  children = "Button",
  type = "button",
  className = "",
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      type={type}
      className={`px-3 py-2 rounded bg-indigo-500 text-white disabled:opacity-30 transition ${className}`}
      {...props}>
      {children}
    </button>
  );
}
