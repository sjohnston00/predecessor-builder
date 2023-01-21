import React from "react";

type RequiredLabelProps = { required?: boolean } & React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export default function RequiredLabel({
  required = false,
  ...props
}: RequiredLabelProps) {
  const { children, className } = props;
  return (
    <label {...props} className={`block mb-1 ${className}`}>
      {children} {required ? <span className='text-red-400'>*</span> : null}
    </label>
  );
}
