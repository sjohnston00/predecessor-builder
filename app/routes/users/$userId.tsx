import React from "react"
import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { prisma } from "~/utils/prisma.server"
import { getUserId } from "~/utils/session.server"

export const loader = async ({ params, request }: LoaderArgs) => {
  const loggedInUserId = await getUserId(request)

  console.log(loggedInUserId)
  const userId = Number(params.userId)

  if (!userId) {
    throw new Response(`Couldn't find user with ID "${params.userId}"`, {
      status: 404,
    })
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
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
