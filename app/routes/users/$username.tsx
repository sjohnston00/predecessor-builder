import React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const { username } = params;
  const loggedInUserId = await getUserId(request);

  if (!username) {
    throw new Response(`Couldn't find user with username "${username}"`, {
      status: 404
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      username
    },
    include: {
      role: true,
      builds: {
        include: {
          hero: true
        }
      }
    }
  });

  if (!user) {
    throw new Response(`Couldn't find user with ID "${params.userId}"`, {
      status: 404
    });
  }

  return { ...user, isLoggedInUser: user.userId === loggedInUserId };
};

export default function UserId() {
  // const {age, email, firstname, lastname, role: {name: roleName}} = useLoaderData<typeof loader>()
  const user = useLoaderData<typeof loader>();

  return (
    <div className='px-1'>
      <Heading type='h1'>User Details</Heading>
      <Heading type='h2'>Builds</Heading>
      {user.builds.map((build) => (
        <div key={build.buildId}>
          <Link to={`/builds/${build.hero.name}/${build.name}`}>
            {build.name}
          </Link>
        </div>
      ))}
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <Form method='post' action='/logout'>
        <Button type='submit'>Logout</Button>
      </Form>
    </div>
  );
}
