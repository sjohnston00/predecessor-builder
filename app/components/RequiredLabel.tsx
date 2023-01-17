import React from "react"

type RequiredLabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>

export default function RequiredLabel(props: RequiredLabelProps) {
  const { children, className } = props
  return (
    <label {...props} className={`block mb-1 ${className}`}>
      {children} <span className="text-red-400">*</span>
    </label>
  )
}
