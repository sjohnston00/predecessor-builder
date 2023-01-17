import React from "react"

export default function Button({
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const { children, type, className } = props
  return (
    <button
      type={type || "button"}
      className={`px-3 py-2 rounded bg-indigo-500 text-white mt-2 disabled:opacity-30 transition ${className}`}>
      {children || "Button"}
    </button>
  )
}
