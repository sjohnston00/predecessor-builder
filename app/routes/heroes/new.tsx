import React from "react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const name = data.name.toString();
  await prisma.hero.create({
    data: {
      name: name
    }
  });
  return redirect(`/heroes/${name}`);
};

export default function NewHero() {
  return (
    <div className='px-1'>
      <h1 className='text-5xl'>Heroes</h1>
      <Form method='post'>
        <div>
          <label htmlFor='name' className='block'>
            Name
          </label>
          <input type='text' name='name' id='name' className='p-2 border' />
        </div>
        <div className='flex gap-2'>
          <button
            type='submit'
            className='p-2 rounded bg-indigo-500 text-white mt-2 disabled:opacity-30 transition'>
            Create
          </button>
          <Link
            className='p-2 rounded bg-slate-500 text-white mt-2 disabled:opacity-30 transition'
            to={`/heroes`}>
            Back
          </Link>
        </div>
      </Form>
    </div>
  );
}
