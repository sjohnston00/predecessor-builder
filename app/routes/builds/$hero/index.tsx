import React from "react";
import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import Heading from "~/components/Heading";
import LinkButton from "~/components/LinkButton";
import Container from "~/components/Container";
import clerkClient from "~/utils/clerk.server";
import { heroExistByName } from "~/utils/heroes.server";

export const loader = async ({ params }: LoaderArgs) => {
  const heroName = params.hero as string;

  const heroExists = await heroExistByName(heroName);

  if (!heroExists) throw redirect("/builds");

  const builds = await prisma.build.findMany({
    where: {
      hero: {
        name: { equals: heroName, mode: "insensitive" }
      }
    },
    include: {
      hero: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (!builds) throw redirect("/builds/");

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

  return { builds: allBuilds, heroName };
};

export default function Hero() {
  const { builds, heroName } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Heading type='h1'>Builds for {heroName}</Heading>
      <div className='flex gap-2'>
        <LinkButton to={"/builds"}>All Builds</LinkButton>
        <LinkButton to={`/heroes/${heroName}`}>{heroName} Info</LinkButton>
      </div>
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
