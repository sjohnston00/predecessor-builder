import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import React from "react";
import RequiredLabel from "~/components/RequiredLabel";
import { prisma } from "~/utils/prisma.server";
import {
  AGE_MAX,
  AGE_MIN,
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  userSchema,
  validatePassword
} from "~/utils/user.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const firstname = data.firstname.toString();
  const lastname = data.lastname.toString();
  const email = data.email.toString();
  const age = Number(data.age.toString());
  const password = data.password.toString();

  const validPassword = validatePassword(password);

  if (!validPassword) {
    return {
      message: `Password must contain: Lowercase, Uppercase, Special Characters and a Number`
    };
  }

  userSchema.parse({
    firstname,
    lastname,
    email,
    age,
    password
  });

  //TODO: validate that password contains uppercase, lowercase, number and special character

  const userExists = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (userExists) {
    return {
      message: `User with this email already exists`
    };
  }

  //TODO: Create the user in prisma
  const { id } = await prisma.user.create({
    data: {
      email,
      firstname,
      lastname,
      age: 22
    },
    select: {
      id: true
    }
  });

  throw redirect(`/users/${id}`);
};

export default function Register() {
  const { state } = useTransition();
  const actionData = useActionData<typeof action>();

  const isSubmitting = state === "submitting";
  return (
    <>
      <Form
        method='post'
        className='flex flex-col justify-center items-center h-screen'>
        <div className='w-72'>
          <h1 className='text-5xl mb-4 font-bold tracking-wide'>Register</h1>
          {actionData?.message ? (
            <div className='text-sm px-2 py-3 bg-red-500 rounded text-white mb-2'>
              {actionData?.message}
            </div>
          ) : null}
          <RequiredLabel htmlFor='firstname'>First Name</RequiredLabel>
          <input
            type='text'
            name='firstname'
            id='firstname'
            minLength={NAME_MIN_LENGTH}
            maxLength={NAME_MAX_LENGTH}
            className='p-2 rounded border-2 border-indigo-500 block w-full mb-2'
            required
          />
          <RequiredLabel htmlFor='lastname'>Last Name</RequiredLabel>
          <input
            type='text'
            name='lastname'
            id='lastname'
            minLength={NAME_MIN_LENGTH}
            maxLength={NAME_MAX_LENGTH}
            className='p-2 rounded border-2 border-indigo-500 block w-full mb-2'
            required
          />
          <RequiredLabel htmlFor='age'>Age</RequiredLabel>
          <input
            type='number'
            name='age'
            id='age'
            min={AGE_MIN}
            max={AGE_MAX}
            className='p-2 rounded border-2 border-indigo-500 block w-full mb-2'
            required
          />
          <RequiredLabel htmlFor='email'>Email</RequiredLabel>
          <input
            type='email'
            name='email'
            id='email'
            minLength={EMAIL_MIN_LENGTH}
            maxLength={EMAIL_MAX_LENGTH}
            className='p-2 rounded border-2 border-indigo-500 block w-full mb-2'
            required
          />
          <RequiredLabel htmlFor='password'>New Password</RequiredLabel>
          <input
            type='password'
            name='password'
            id='password'
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            className='p-2 rounded border-2 border-indigo-500 block w-full mb-2'
            autoComplete='new-password'
            required
          />
          <div className='flex items-baseline gap-2'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='p-2 rounded bg-indigo-500 text-white mt-2 disabled:opacity-30 transition'>
              Register
            </button>
            <Link to={"/login"} className='text-indigo-500 underline'>
              Already a member? Login
            </Link>
          </div>
        </div>
      </Form>
    </>
  );
}
