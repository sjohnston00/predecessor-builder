import React from "react"
import { Link } from "@remix-run/react"
import Container from "./Container"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix"

export default function Navbar() {
  return (
    <nav className="py-4 bg-indigo-500 text-white font-semibold tracking-widest mb-6">
      <Container>
        <ul className="flex flex-col md:flex-row gap-6 md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row md:items-center items-start gap-2">
            <li>
              <Link className="p-1" to={"/"}>
                Pred-Build
              </Link>
            </li>
            <li>
              <Link className="p-1" to="/heroes">
                Heroes
              </Link>
            </li>
            <li>
              <Link className="p-1" to="/items">
                Items
              </Link>
            </li>
            <li>
              <Link className="p-1" to="/builds">
                Builds
              </Link>
            </li>
          </div>
          <div className="flex flex-col md:flex-row md:items-center items-start gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </ul>
      </Container>
    </nav>
  )
}
