import { Link } from "@remix-run/react"
import type { RemixLinkProps } from "@remix-run/react/dist/components"
import React from "react"

export default function LinkButton({
  className = "",
  children,
  ...props
}: RemixLinkProps) {
  return (
    <Link
      className={`px-3 py-2 rounded bg-indigo-500 text-white disabled:opacity=-30 transition inline-block ${className}`}
      {...props}>
      {children}
    </Link>
  )
}
