import React from "react"
import type { ActionArgs } from "@remix-run/node"
import { Form, Link, useActionData, useTransition } from "@remix-run/react"
import RequiredLabel from "~/components/RequiredLabel"
import { prisma } from "~/utils/prisma.server"
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  userSchema,
  validatePassword,
} from "~/utils/user.server"
import bcrypt from "bcryptjs"
import Input from "~/components/Input"
import Button from "~/components/Button"
import PasswordInput from "~/components/PasswordInput"
import { createUserSession } from "~/utils/session.server"

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const username = data.username.toString()
  const password = data.password.toString()

  const validPassword = validatePassword(password)

  userSchema.parse({
    username,
    password,
  })

  if (!validPassword) {
    return {
      message: `Password must contain: Lowercase, Uppercase, Special Characters and a Number`,
    }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const userExists = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (userExists) {
    return {
      message: `User with this email already exists`,
    }
  }

  const { userId } = await prisma.user.create({
    data: {
      username: username,
      role: {
        connect: {
          name: "User",
        },
      },
    },
  })

  await prisma.userPassword.create({
    data: {
      passwordHash,
      userId,
    },
  })

  return createUserSession(userId, `/users/${username}`)
}

export default function Register() {
  const { state } = useTransition()
  const actionData = useActionData()

  const isSubmitting = state === "submitting"
  return (
    <div className="px-1">
      <Form
        method="post"
        className="flex flex-col justify-center items-center h-screen">
        <div className="sm:w-80 md:w-96">
          <h1 className="text-5xl mb-4 font-bold tracking-wide">Register</h1>
          {actionData?.message ? (
            <div className="text-sm px-2 py-3 bg-red-500 rounded text-white mb-2">
              {actionData?.message}
            </div>
          ) : null}
          <RequiredLabel htmlFor="username">Username</RequiredLabel>
          <Input
            type="username"
            name="username"
            id="username"
            minLength={USERNAME_MIN_LENGTH}
            maxLength={USERNAME_MAX_LENGTH}
            required
          />
          <RequiredLabel htmlFor="password">New Password</RequiredLabel>
          <PasswordInput autoComplete="new-password" />

          <div className="flex items-baseline gap-2">
            <Button type="submit" disabled={isSubmitting}>
              Register
            </Button>
            <Link to={"/login"} className="text-indigo-500 underline">
              Already a member? Login
            </Link>
          </div>
        </div>
      </Form>
    </div>
  )
}
