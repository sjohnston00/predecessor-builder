import React from "react";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import Label from "~/components/Label";
import { prisma } from "~/utils/prisma.server";
import {
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  userSchema,
  validatePassword
} from "~/utils/user.server";
import bcrypt from "bcryptjs";
import Input from "~/components/Input";
import Button from "~/components/Button";
import PasswordInput from "~/components/PasswordInput";
import { createUserSession, getUser } from "~/utils/session.server";
import Container from "~/components/Container";
import Heading from "~/components/Heading";

export const loader = async ({ request }: LoaderArgs) => {
  const loggedInUser = await getUser(request);
  if (loggedInUser) {
    return redirect(`/users/${loggedInUser.username}`);
  }
  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const username = data.username.toString();
  const password = data.password.toString();

  const validPassword = validatePassword(password);

  userSchema.parse({
    username,
    password
  });

  if (!validPassword) {
    return {
      message: `Password must contain: Lowercase, Uppercase, Special Characters and a Number`
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const userExists = await prisma.user.findFirst({
    where: {
      username
    }
  });

  if (userExists) {
    return {
      message: `User with this email already exists`
    };
  }

  const { userId } = await prisma.user.create({
    data: {
      username: username,
      role: {
        connect: {
          name: "User"
        }
      }
    }
  });

  await prisma.userPassword.create({
    data: {
      passwordHash,
      userId
    }
  });

  return createUserSession(userId, `/users/${username}`);
};

export default function Register() {
  const { state } = useTransition();
  const actionData = useActionData();

  const isSubmitting = state === "submitting";
  return (
    <Container>
      <Form method='post' className='flex flex-col justify-center h-screen'>
        <Heading type='h1' className='mb-2'>
          Register
        </Heading>
        {actionData?.message ? (
          <div className='text-sm px-2 py-3 bg-red-500 rounded text-white mb-2'>
            {actionData?.message}
          </div>
        ) : null}
        <Label htmlFor='username' required>
          Username
        </Label>
        <Input
          type='username'
          name='username'
          id='username'
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
          required
        />
        <Label htmlFor='password' required>
          New Password
        </Label>
        <PasswordInput autoComplete='new-password' />

        <div className='flex items-baseline gap-2'>
          <Button type='submit' disabled={isSubmitting}>
            Register
          </Button>
          <Link to={"/login"} className='text-indigo-500 underline p-1'>
            Already a member? Login
          </Link>
        </div>
      </Form>
    </Container>
  );
}
