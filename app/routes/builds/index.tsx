import React from "react";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import Heading from "~/components/Heading";
import LinkButton from "~/components/LinkButton";
import clerkClient from "~/utils/clerk.server";
import Container from "~/components/Container";

export const loader = async () => {
  const builds = await prisma.build.findMany({
    include: {
      hero: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const allUsers = await clerkClient.users.getUserList();

  const allBuilds = builds.map((build) => {
    const user = allUsers.filter(
      (clerkUser) => clerkUser.id === build.userId
    )[0];

    return {
      ...build,
      user
    };
  });

  return { builds: allBuilds };
};

export default function Index() {
  const { builds } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Heading type='h1'>All builds</Heading>
      <div className='flex flex-col gap-2'>
        {builds.map((build) => (
          <div
            key={`build-${build.buildId}`}
            className='flex justify-between h-20 items-center'>
            <Link
              reloadDocument
              to={`/builds/${build.hero.name}/${build.name}`}
              className='p-1'>
              {build.name}
            </Link>
            <div className='flex flex-col'>
              <Link
                to={`/builds/${build.hero.name}`}
                className='text-sm text-slate-500 inline p-1'>
                Hero: {build.hero.name}
              </Link>
              <Link
                to={
                  build.user?.username ? `/users/${build.user.username}` : "#"
                }
                className='text-sm text-slate-500 inline p-1'>
                {build.user?.username || "Anonymous"}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <LinkButton to={"/builds/new"}>New</LinkButton>
    </Container>
  );
}
