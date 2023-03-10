import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { prisma } from "./prisma.server"

const sessionSecret = process.env.SESSION_SECRET
let sessionUserId = "userId"

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"))
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get(sessionUserId)
  if (!userId || typeof userId !== "string") return null
  return userId
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request)
  const userId = session.get(sessionUserId)
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createUserSession(
  userId: string,
  redirectTo: string = "/"
) {
  const session = await storage.getSession()
  session.set(sessionUserId, userId)
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  })
}

export async function getUser(request: Request) {
  const userId = await getUserId(request)
  if (typeof userId !== "string") {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { userId },
    })
    return user
  } catch {
    throw logout(request)
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  })
}
