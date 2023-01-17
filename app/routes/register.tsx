import React from "react"
import type { ActionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, Link, useActionData, useTransition } from "@remix-run/react"
import RequiredLabel from "~/components/RequiredLabel"
import { prisma } from "~/utils/prisma.server"
import {
  AGE_MAX,
  AGE_MIN,
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  userSchema,
  validatePassword,
} from "~/utils/user.server"
import bcrypt from "bcryptjs"
import Input from "~/components/Input"
import Button from "~/components/Button"
import PasswordInput from "~/components/PasswordInput"

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const firstname = data.firstname.toString()
  const lastname = data.lastname.toString()
  const email = data.email.toString()
  const age = Number(data.age.toString())
  const password = data.password.toString()

  const validPassword = validatePassword(password)

  if (!validPassword) {
    return {
      message: `Password must contain: Lowercase, Uppercase, Special Characters and a Number`,
    }
  }
  const hash = await bcrypt.hash(password, 10)

  userSchema.parse({
    firstname,
    lastname,
    email,
    age,
    password,
  })

  const userExists = await prisma.user.findFirst({
    where: {
      email: email,
    },
  })

  if (userExists) {
    return {
      message: `User with this email already exists`,
    }
  }

  const { id } = await prisma.user.create({
    data: {
      email,
      firstname,
      lastname,
      age: 22,
    },
    select: {
      id: true,
    },
  })

  await prisma.userPassword.create({
    data: {
      passwordHash: hash,
      userId: id,
    },
  })

  throw redirect(`/users/${id}`)
}

export default function Register() {
  const { state } = useTransition()
  const actionData = useActionData<typeof action>()

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
          <div className="flex gap-3">
            <div className="w-full">
              <RequiredLabel htmlFor="firstname">First Name</RequiredLabel>
              <Input
                type="text"
                name="firstname"
                id="firstname"
                minLength={NAME_MIN_LENGTH}
                maxLength={NAME_MAX_LENGTH}
                required
              />
            </div>

            <div className="w-full">
              <RequiredLabel htmlFor="lastname">Last Name</RequiredLabel>
              <Input
                type="text"
                name="lastname"
                id="lastname"
                minLength={NAME_MIN_LENGTH}
                maxLength={NAME_MAX_LENGTH}
                required
              />
            </div>
          </div>
          <RequiredLabel htmlFor="age">Age</RequiredLabel>
          <Input
            type="number"
            name="age"
            id="age"
            min={AGE_MIN}
            max={AGE_MAX}
            required
          />
          <RequiredLabel htmlFor="email">Email</RequiredLabel>
          <Input
            type="email"
            name="email"
            id="email"
            minLength={EMAIL_MIN_LENGTH}
            maxLength={EMAIL_MAX_LENGTH}
            required
          />
          <RequiredLabel htmlFor="password">New Password</RequiredLabel>
          <PasswordInput />

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
