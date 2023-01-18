import React from "react"
import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { prisma } from "~/utils/prisma.server"

export const loader = async ({ params, request }: LoaderArgs) => {
  const { username } = params

  if (!username) {
    throw new Response(`Couldn't find user with username "${username}"`, {
      status: 404,
    })
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
    include: {
      role: true,
      password: {
        select: {
          passwordHash: true,
        },
      },
    },
  })

  if (!user) {
    throw new Response(`Couldn't find user with ID "${params.userId}"`, {
      status: 404,
    })
  }

  return user
}

export default function UserId() {
  // const {age, email, firstname, lastname, role: {name: roleName}} = useLoaderData<typeof loader>()
  const user = useLoaderData<typeof loader>()

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}
