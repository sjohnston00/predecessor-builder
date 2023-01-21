import React from "react";
import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getHeroByName } from "~/utils/heroes.server";

export const loader = async ({ params }: LoaderArgs) => {
  const heroName = params.hero as string;

  const hero = await getHeroByName(heroName);

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
      <h1 className='text-5xl'>Heroes</h1>
      <h2 className='text-4xl'>{hero?.name}</h2>

      <h2 className='text-4xl'>Builds</h2>
      <ul className='mt-4'>
        {hero.builds.map((build) => (
          <li key={`${hero.name}-build-${build.buildId}`}>
            <Link to={`/builds/${hero.name}/${build.name}`}>{build.name}</Link>
          </li>
        ))}
      </ul>

      <h2 className='text-4xl'>Abilites</h2>
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
