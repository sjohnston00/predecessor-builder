import React from "react";

type RequiredLabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

export default function RequiredLabel(props: RequiredLabelProps) {
  const { children } = props;
  return (
    <label {...props}>
      {children} <span className='text-red-400'>*</span>
    </label>
  );
}
