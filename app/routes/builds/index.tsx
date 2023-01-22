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
      <div className='flex flex-col gap-2'>
        {builds.map((build) => (
          <div
            key={`build-${build.buildId}`}
            className='flex justify-between h-20 items-center'>
            <Link
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
                  build.user?.username ? `/users/${build.user?.username}` : "#"
                }
                className='text-sm text-slate-500 inline p-1'>
                {build.user?.username || "Anonymous"}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <LinkButton to={"/builds/new"}>New</LinkButton>
    </div>
  );
}
