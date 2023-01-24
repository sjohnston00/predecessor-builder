import React from "react"

export default function Input({
  className = "",
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <input
      className={`bg-transparent px-3 py-2 text-base shadow rounded border-2 focus:border-indigo-600 focus:outline-none border-indigo-300 block w-full mb-2 ${className}`}
      {...props}
    />
  )
}
