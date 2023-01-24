import { Link } from "@remix-run/react";
import React from "react";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import items from "~/items.json";
import { urlParametize } from "~/utils";

export default function Items() {
  return (
    <Container>
      <div className='grid grid-cols-3 md:grid-cols-4 gap-4'>
        {items.map((item) => (
          <Link
            to={`/items/${urlParametize(item.name)}`}
            key={item.name}
            className='flex flex-col gap-2 items-center'>
            <img
              src={item.image}
              height={100}
              width={100}
              alt='item'
              className='self-center'
            />{" "}
            <Heading type='h6'>{item.name}</Heading>
            <div className='item-description'>
              {/* {item.descriptions?.map((desc, i) => (
                <p key={`${item.name}-${desc.descriptionType}-${i}`}>
                  <b>{desc.descriptionType}:</b> {desc.description}
                </p>
              ))} */}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
