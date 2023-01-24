import { Link } from "@remix-run/react";
import React from "react";
import Container from "~/components/Container";
import Heading from "~/components/Heading";
import items from "~/items.json";
import { urlParametize } from "~/utils";

export default function Items() {
  return (
    <Container>
      <div className='flex flex-col gap-10'>
        {items.map((item) => (
          <Link
            to={`/items/${urlParametize(item.name)}`}
            key={item.name}
            className='flex gap-2 items-start'>
            <img
              src={item.image}
              height={100}
              width={100}
              alt='item'
              className='self-center'
            />{" "}
            <div className='item-description'>
              <Heading type='h5'>{item.name}</Heading>
              {item.descriptions?.map((desc, i) => (
                <p key={`${item.name}-${desc.descriptionType}-${i}`}>
                  <b>{desc.descriptionType}:</b> {desc.description}
                </p>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
