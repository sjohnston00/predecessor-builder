import React from "react";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import Heading from "~/components/Heading";
import LinkButton from "~/components/LinkButton";

export const loader = async () => {
  const builds = await prisma.build.findMany({
    include: {
      hero: true,
      user: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return { builds };
};

export default function Index() {
  const { builds } = useLoaderData<typeof loader>();
  return (
    <div className='px-1'>
      <Heading type='h1'>All builds</Heading>
      <ul>
        {builds.map((build) => (
          <li key={`build-${build.buildId}`} className='flex flex-col'>
            <Link to={`/builds/${build.hero.name}/${build.name}`}>
              {build.name}
            </Link>
            <Link
              to={`/heroes/${build.hero.name}`}
              className='text-sm text-slate-500 inline'>
              Hero: {build.hero.name}
            </Link>
            <Link
              to={build.user?.username ? `/users/${build.user?.username}` : "#"}
              className='text-sm text-slate-500 inline'>
              {build.user?.username || "Anonymous"}
            </Link>
          </li>
        ))}
      </ul>
      <LinkButton to={"/builds/new"}>New</LinkButton>
    </div>
  );
}
