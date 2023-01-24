import React from "react"

type RequiredLabelProps = { required?: boolean } & React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>

export default function RequiredLabel({
  required = false,
  className = "",
  children,
  ...props
}: RequiredLabelProps) {
  return (
    <label className={`block mb-1 ${className}`} {...props}>
      {children} {required ? <span className="text-red-400">*</span> : null}
    </label>
  )
}
