import React from "react"
import type { LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import Container from "~/components/Container"
import Heading from "~/components/Heading"
import items from "~/items.json"
import LinkButton from "~/components/LinkButton"

export const loader = async ({ params }: LoaderArgs) => {
  const item = items.filter(
    (item) =>
      item.name.toLowerCase() ===
      params.itemName?.toLowerCase().replaceAll("-", " ")
  )[0]
  if (!item) throw redirect("/items")
  return item
}

export default function $itemName() {
  const item = useLoaderData<typeof loader>()
  console.log(item)
  return (
    <Container>
      <LinkButton
        to={"/items"}
        className="inline-flex gap-2 justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </LinkButton>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <Heading type="h1">{item.name}</Heading>
          <Heading type="h6" className="text-indigo-500">
            {item.cost}
          </Heading>
        </div>
        <img
          src={item.image}
          height={75}
          width={75}
          className="rounded-lg shadow"
          alt={item.name}
        />
      </div>
      <div className="mt-4">
        {Object.entries(item.stats).map(([key, value], i) => (
          <p key={`${item.name}-stat-${key}-${i}`}>
            <span className="text-emerald-500 tracking-wide font-semibold mr-4">
              +{value}
            </span>
            {key}
          </p>
        ))}
      </div>
      <div className="mt-4">
        {item.descriptions.map((desc, i) => (
          <p key={`${item.name}-${desc.descriptionType}-${i}`}>
            <span className="text-indigo-500 tracking-wide font-semibold">
              {desc.descriptionType}:
            </span>{" "}
            {desc.description}
          </p>
        ))}
      </div>
    </Container>
  )
}
