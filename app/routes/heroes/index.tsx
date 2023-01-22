import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import Heading from "~/components/Heading";
import { getAllHeroes } from "~/utils/heroes.server";

export const loader = async () => {
  const heroes = await getAllHeroes();
  return { heroes };
};

export default function Index() {
  const { heroes } = useLoaderData<typeof loader>();
  return (
    <div className='px-1'>
      <Heading type='h1'>Heroes</Heading>
      <ul className='mt-4'>
        {heroes.map((hero) => (
          <li key={hero.heroId} className='flex flex-col'>
            <Link to={`/heroes/${hero.name}`}>{hero.name}</Link>
            <Link
              to={`/builds/${hero.name}`}
              className='text-sm text-slate-500 inline'>
              Builds: {hero.builds.length}
            </Link>
          </li>
        ))}
      </ul>

      <div className='flex items-baseline gap-2'>
        <Link
          className='p-2 rounded bg-slate-500 text-white mt-2 disabled:opacity-30 transition'
          to={`/heroes/new`}>
          New
        </Link>
      </div>
    </div>
  );
}
