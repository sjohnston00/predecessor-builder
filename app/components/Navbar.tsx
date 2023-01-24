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
    <nav className="py-4 bg-indigo-500 text-white font-semibold tracking-wider mb-6">
      <Container>
        <ul className="flex flex-col md:flex-row gap-6 md:justify-between md:items-center">
          <div className="flex flex-col md:flex-row md:items-center items-start gap-2">
            <li>
              <Link className="p-1" to={"/"}>
                Pred-Build
              </Link>
            </li>
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
          <div className="flex flex-col md:flex-row md:items-center items-start gap-2">
            {user ? (
              <>
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </ul>
      </Container>
    </nav>
  )
}
