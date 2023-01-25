import React from "react"
import type { LoaderArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import Button from "~/components/Button"
import Container from "~/components/Container"
import Heading from "~/components/Heading"
import Input from "~/components/Input"
import Label from "~/components/Label"
import items from "~/items.json"
import { urlParametize } from "~/utils"

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const search = url.searchParams.get("search")

  return {
    items: items.filter((item) =>
      item.name.toLowerCase().includes(search || "")
    ),
    search,
  }
}

export default function Items() {
  const { items, search } = useLoaderData<typeof loader>()
  return (
    <Container>
      <Heading type="h1" className="mb-2">
        Items
      </Heading>
      <Form className="mb-4" method="get">
        <Label>Search</Label>
        <div className="flex">
          <Input
            type="text"
            name="search"
            id="search"
            defaultValue={search || ""}
            placeholder="Empty means all..."
            className="rounded-tr-none rounded-br-none border-r-0 self-stretch h-auto block mb-0"
          />
          <Button className="rounded-tl-none rounded-bl-none" type="submit">
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </Button>
        </div>
      </Form>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            to={`/items/${urlParametize(item.name)}`}
            key={item.name}
            className="flex flex-col gap-2 items-center">
            <img
              src={item.image}
              height={100}
              width={100}
              alt="item"
              className="rounded-lg shadow"
            />{" "}
            <Heading type="h6">{item.name}</Heading>
          </Link>
        ))}
      </div>
    </Container>
  )
}
