import React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
// import { getHeroByName } from "~/utils/heroes.server";
import Heading from "~/components/Heading";
import LinkButton from "~/components/LinkButton";
import { prisma } from "~/utils/prisma.server";

export const loader = async ({ params }: LoaderArgs) => {
  const heroName = params.hero as string;

  // const hero = await getHeroByName(heroName);

  const hero = await prisma.hero.findFirst({
    where: {
      name: { mode: "insensitive", equals: heroName }
    },
    include: {
      abilities: true,
      builds: {
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      }
    }
  });

  if (!hero) {
    console.error(`Couldn't find a hero with name "${heroName}"`);

    throw redirect("/heroes");
  }

  return { hero };
};

export default function Hero() {
  const { hero } = useLoaderData<typeof loader>();
  return (
    <div className='px-1'>
      <Heading type='h1'>Heroes</Heading>
      <LinkButton to={"/heroes"}>All Heroes</LinkButton>
      <Heading type='h2'>{hero?.name}</Heading>

      <Heading type='h2'>Builds</Heading>
      <ul className='mt-4'>
        {hero.builds.map((build) => (
          <li key={`${hero.name}-build-${build.buildId}`}>
            <Link to={`/builds/${hero.name}/${build.name}`}>{build.name}</Link>
          </li>
        ))}
      </ul>
      <LinkButton to={`/builds/${hero.name}`}>
        All {hero.name} Builds
      </LinkButton>

      <Heading type='h2'>Abilites</Heading>
      <ul className='mt-4'>
        {hero.abilities.map((ability) => (
          <li key={`${hero.name}-ability-${ability.abilityId}`}>
            {ability.name}
          </li>
        ))}
      </ul>
      <Link
        className='p-2 rounded bg-slate-500 text-white mt-2 disabled:opacity-30 transition'
        to={`/heroes`}>
        Back
      </Link>
    </div>
  );
}
