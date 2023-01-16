import React from "react"
import { useLoaderData, Link } from "@remix-run/react"
import { prisma } from "~/utils/prisma.server"

export const loader = async () => {
  const builds = await prisma.build.findMany({
    include: {
      hero: true,
      user: true,
    },
  })

  return { builds }
}

export default function Index() {
  const { builds } = useLoaderData<typeof loader>()
  return (
    <div className="px-1">
      <h1 className="text-5xl">All builds</h1>
      <ul>
        {builds.map((build) => (
          <li key={`build-${build.id}`} className="flex flex-col">
            <Link to={`/builds/${build.hero.name}/${build.id}`}>
              {build.name}
            </Link>
            <Link
              to={`/heroes/${build.hero.name}`}
              className="text-sm text-slate-500 inline">
              Hero: {build.hero.name}
            </Link>
            <Link
              to={`/users/${build.user.id}`}
              className="text-sm text-slate-500 inline">
              User: {build.user.firstname} {build.user.lastname}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
