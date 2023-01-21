import React from "react";
import { redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";

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
    }
  });

  if (!builds) throw redirect("/builds/");

  return { builds, heroName };
};

export default function Hero() {
  const { builds, heroName } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1 className='text-5xl'>Builds for {heroName}</h1>
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
