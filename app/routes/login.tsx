import React from "react"
import type { ActionArgs } from "@remix-run/node"
import { Form, Link, useActionData, useTransition } from "@remix-run/react"
import RequiredLabel from "~/components/RequiredLabel"
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
import { createUserSession } from "~/utils/session.server"

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

  return createUserSession(user.userId, `/users/${user.username}`)
}
export default function Login() {
  const { state } = useTransition()
  const actionData = useActionData()

  const isSubmitting = state === "submitting"
  return (
    <>
      <Form
        method="post"
        className="flex flex-col justify-center items-center h-screen">
        <div className="w-72">
          <h1 className="text-5xl mb-4 font-bold tracking-wide">Login</h1>
          {actionData?.message ? (
            <div className="text-sm px-2 py-3 bg-red-500 rounded text-white mb-2">
              {actionData?.message}
            </div>
          ) : null}
          <RequiredLabel htmlFor="username">Username</RequiredLabel>
          <Input
            type="text"
            name="username"
            id="username"
            minLength={USERNAME_MIN_LENGTH}
            maxLength={USERNAME_MAX_LENGTH}
            required
          />
          <RequiredLabel htmlFor="password">Password</RequiredLabel>
          <PasswordInput />
          <div className="flex items-baseline gap-2">
            <Button type="submit" disabled={isSubmitting}>
              Login
            </Button>
            <Link to={"/register"} className="text-indigo-500 underline">
              Not a member? Register
            </Link>
          </div>
        </div>
      </Form>
    </>
  )
}
