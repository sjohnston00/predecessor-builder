import React from "react";
import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import Heading from "~/components/Heading";
import LinkButton from "~/components/LinkButton";

export const loader = async ({ params }: LoaderArgs) => {
  const heroName = params.hero as string;

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

  return { builds, heroName };
};

export default function Hero() {
  const { builds, heroName } = useLoaderData<typeof loader>();
  return (
    <div>
      <Heading type='h1'>Builds for {heroName}</Heading>
      <div className='flex gap-2'>
        <LinkButton to={"/builds"}>All Builds</LinkButton>
        <LinkButton to={`/heroes/${heroName}`}>{heroName} Info</LinkButton>
      </div>
      <ul>
        {builds.map((build) => (
          <li key={`build-${build.buildId}`}>
            <Link to={`/builds/${heroName}/${build.name}`}>{build.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
