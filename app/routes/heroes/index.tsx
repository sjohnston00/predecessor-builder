import { Link, useLoaderData } from "@remix-run/react"
import React from "react"
import Container from "~/components/Container"
import Heading from "~/components/Heading"
import { getAllHeroes } from "~/utils/heroes.server"

export const loader = async () => {
  const heroes = await getAllHeroes()
  return { heroes }
}

export default function Index() {
  const { heroes } = useLoaderData<typeof loader>()
  return (
    <Container>
      <Heading type="h1">Heroes</Heading>
      {heroes.map((hero) => (
        <div key={hero.heroId} className="flex justify-between ">
          <Link to={`/heroes/${hero.name}`}>{hero.name}</Link>
          <Link to={`/builds/${hero.name}`} className="text-sm text-slate-500">
            Builds: <span>{hero.builds.length}</span>
          </Link>
        </div>
      ))}

      <div className="flex items-baseline gap-2">
        <Link
          className="p-2 rounded bg-slate-500 text-white mt-2 disabled:opacity-30 transition"
          to={`/heroes/new`}>
          New
        </Link>
      </div>
    </Container>
  )
}
