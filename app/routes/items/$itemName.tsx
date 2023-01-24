import { LoaderArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import items from "~/items.json";

export const loader = async ({ params }: LoaderArgs) => {
  const item = items.filter(
    (item) =>
      item.name.toLowerCase() ===
      params.itemName?.toLowerCase().replaceAll("-", " ")
  )[0];
  if (!item) throw redirect("/items");
  return item;
};

export default function $itemName() {
  const item = useLoaderData<typeof loader>();
  console.log(item);
  return (
    <Container>
      <div className='flex justify-between items-center'>
        <Heading type='h1'>{item.name}</Heading>
        <img src={item.image} height={75} width={75} alt={item.name} />
      </div>
    </Container>
  );
}
