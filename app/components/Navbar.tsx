import React from "react"
import type { User } from "@prisma/client"
import { Form, Link } from "@remix-run/react"
import Button from "./Button"
import Container from "./Container"

type Props = {
  user: User | null
}

export default function Navbar({ user }: Props) {
  return (
    <nav className="h-12 bg-indigo-500 text-white">
      <Container className="h-full">
        <ul className="flex h-full gap-2 justify-between items-center">
          <div className="flex items-center gap-2">
            <li>
              <Link className="p-1" to={"/heroes"}>
                Heroes
              </Link>
            </li>
            <li>
              <Link className="p-1" to={"/builds"}>
                Builds
              </Link>
            </li>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <li>
                <Link className="p-1" to={`/users/${user.username}`}>
                  My Account
                </Link>
              </li>
              <li>
                <Form method="post" action="/logout">
                  <Button type="submit">Logout</Button>
                </Form>
              </li>
            </div>
          ) : (
            <div className="flex gap-2">
              <li>
                <Link className="p-1" to={`/register`}>
                  Register
                </Link>
              </li>
              <li>
                <Link className="p-1" to={`/login`}>
                  Login
                </Link>
              </li>
            </div>
          )}
        </ul>
      </Container>
    </nav>
  )
}
