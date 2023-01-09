import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import React from "react";
import RequiredLabel from "~/components/RequiredLabel";
import { prisma } from "~/utils/prisma.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const email = data.email.toString();
  const password = data.password.toString();

  const user = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (!user) {
    return {
      message: `Email or password incorrect`
    };
  }

  throw redirect(`/users/${user.id}`);
};
export default function Login() {
  const { state } = useTransition();
  const actionData = useActionData<typeof action>();

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
          <input
            type='email'
            name='email'
            id='email'
            minLength={6}
            maxLength={255}
            className='p-2 rounded border-2 border-indigo-500 block w-full mb-2'
            required
          />
          <RequiredLabel htmlFor='password'>Password</RequiredLabel>
          <input
            type='password'
            name='password'
            id='password'
            minLength={6}
            maxLength={255}
            className='p-2 rounded border-2 border-indigo-500 block w-full mb-2'
            required
          />
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
