import React from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, Link, useActionData, useTransition } from "@remix-run/react"
import Label from "~/components/Label"
import { prisma } from "~/utils/prisma.server"
import bcrypt from "bcryptjs"
import Input from "~/components/Input"
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  userSchema,
} from "~/utils/user.server"
import PasswordInput from "~/components/PasswordInput"
import Button from "~/components/Button"
import { createUserSession, getUser } from "~/utils/session.server"
import Heading from "~/components/Heading"
import Container from "~/components/Container"
import { SignIn } from "@clerk/remix"

export const loader = async ({ request }: LoaderArgs) => {
  const loggedInUser = await getUser(request)
  if (loggedInUser) {
    return redirect(`/users/${loggedInUser.username}`)
  }
  return null
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const username = data.username.toString()
  const password = data.password.toString()

  userSchema.parse({
    username,
    password,
  })

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      password: {
        select: {
          passwordHash: true,
        },
      },
    },
  })

  const errorMessage = `Email or password incorrect`
  if (!user) {
    return {
      message: errorMessage,
    }
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password?.passwordHash || ""
  )

  if (!passwordMatch) {
    return {
      message: errorMessage,
    }
  }
  const url = new URL(request.url)
  const redirectTo =
    url.searchParams.get("redirectTo") || `/users/${user.username}`

  return createUserSession(user.userId, redirectTo)
}
export default function Login() {
  const { state } = useTransition()
  return (
    <Container className="mt-32">
      <SignIn />
      {/* <Form method="post" className="flex flex-col">
        <Heading type="h1" className="mb-2">
          Login
        </Heading>
        {actionData?.message ? (
          <div className="text-sm px-2 py-3 bg-red-500 rounded text-white mb-2">
            {actionData?.message}
          </div>
        ) : null}
        <Label htmlFor="username" required>
          Username
        </Label>
        <Input
          type="text"
          name="username"
          id="username"
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
          autoComplete="username"
          required
        />
        <Label htmlFor="password" required>
          Password
        </Label>
        <PasswordInput autoComplete="current-password" />
        <div className="flex items-baseline gap-2">
          <Button type="submit" disabled={isSubmitting}>
            Login
          </Button>
          <Link to={"/register"} className="text-indigo-500 underline p-1">
            Not a member? Register
          </Link>
        </div>
      </Form> */}
    </Container>
  )
}
