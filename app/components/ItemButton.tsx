import React from "react";
import type { Item } from "~/types/items.server";
import Button from "./Button";

type ItemButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  item: Item;
  imageHeight?: number;
  imageWidth?: number;
};

export default function ItemButton({
  item,
  className = "",
  imageHeight = 150,
  imageWidth = 150,
  ...props
}: ItemButtonProps) {
  return (
    <Button
      className={`inline-flex flex-col gap-2 items-center bg-transparent text-black my-2 ${className}`}
      {...props}>
      <img
        src={item.image}
        height={imageHeight}
        width={imageWidth}
        alt={item.name}
        className='rounded-lg shadow'
      />
      {item.name}
    </Button>
  );
}
