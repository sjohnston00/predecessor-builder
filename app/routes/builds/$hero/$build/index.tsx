import React from "react"
import { redirect } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { prisma } from "~/utils/prisma.server"

export const loader = async ({ params }: LoaderArgs) => {
  const buildId = Number(params.build)

  if (!buildId) throw redirect("/builds/")

  const build = await prisma.build.findFirst({
    where: {
      id: buildId,
    },
    include: {
      hero: true,
      user: true,
    },
  })

  if (!build) throw redirect("/builds/")

  return { build }
}

export default function BuildNumber() {
  const { build } = useLoaderData<typeof loader>()
  return (
    <div>
      Hero: {build.hero.name} Build Number: {build.id} By:{" "}
      {build.user
        ? `${build.user?.firstname} ${build.user?.lastname}`
        : "Anonymous"}
      <p>Skill Order: [{build.abilityOrder.toLocaleString()}]</p>
    </div>
  )
}
