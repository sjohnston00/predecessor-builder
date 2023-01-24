import React from "react"

export default function Textarea({
  className = "",
  ...props
}: React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>) {
  return (
    <textarea
      className={`bg-transparent px-3 py-2 text-base shadow rounded border-2 focus:border-indigo-600 focus:outline-none border-indigo-300 block h-40 w-full mb-2 ${className}`}
      {...props}
    />
  )
}
