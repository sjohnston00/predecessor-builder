import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import Navbar from "./components/Navbar"
import styles from "./styles/app.css"
import { rootAuthLoader } from "@clerk/remix/ssr.server"
import { ClerkApp, ClerkCatchBoundary } from "@clerk/remix"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
})

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }]
}

export const loader = (args: LoaderArgs) => {
  return rootAuthLoader(
    args,
    ({ request }) => {
      const { userId, sessionId, getToken } = request.auth
      return { message: `Hello from the root loader :)` }
    },
    { loadUser: true }
  )
}

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="w-screen bg-neutral-50 min-h-screen">
        <Navbar />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
export default ClerkApp(App)
export const CatchBoundary = ClerkCatchBoundary()
