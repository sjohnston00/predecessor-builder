import React from "react";
import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import RequiredLabel from "~/components/RequiredLabel";
import { prisma } from "~/utils/prisma.server";
import bcrypt from "bcryptjs";
import Input from "~/components/Input";
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH } from "~/utils/user.server";
import PasswordInput from "~/components/PasswordInput";
import { createUserSession } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const email = data.email.toString();
  const password = data.password.toString();

  const user = await prisma.user.findFirst({
    where: {
      email: email
    },
    include: {
      password: {
        select: {
          passwordHash: true
        }
      }
    }
  });

  const errorMessage = `Email or password incorrect`;
  if (!user) {
    return {
      message: errorMessage
    };
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password?.passwordHash || ""
  );

  if (!passwordMatch) {
    return {
      message: errorMessage
    };
  }

  return createUserSession(user.id);
};
export default function Login() {
  const { state } = useTransition();
  const actionData = useActionData();

  const isSubmitting = state === "submitting";
  return (
    <>
      <Form
        method='post'
        className='flex flex-col justify-center items-center h-screen'>
        <div className='w-72'>
          <h1 className='text-5xl mb-4 font-bold tracking-wide'>Login</h1>
          {actionData?.message ? (
            <div className='text-sm px-2 py-3 bg-red-500 rounded text-white mb-2'>
              {actionData?.message}
            </div>
          ) : null}
          <RequiredLabel htmlFor='email'>Email</RequiredLabel>
          <Input
            type='email'
            name='email'
            id='email'
            minLength={EMAIL_MIN_LENGTH}
            maxLength={EMAIL_MAX_LENGTH}
            required
          />
          <RequiredLabel htmlFor='password'>Password</RequiredLabel>
          <PasswordInput />
          <div className='flex items-baseline gap-2'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='p-2 rounded bg-indigo-500 text-white mt-2 disabled:opacity-30 transition shadow'>
              Login
            </button>
            <Link to={"/register"} className='text-indigo-500 underline'>
              Not a member? Register
            </Link>
          </div>
        </div>
      </Form>
    </>
  );
}
