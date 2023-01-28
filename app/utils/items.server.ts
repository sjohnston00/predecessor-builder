import items from "~/items.json";
import type { Item } from "~/types/items.server";

export function getAllItems() {
  return items as Item[];
}

export function getItemsLikeName(name: string) {
  return items.filter((item) =>
    item.name.toLowerCase().includes(name.toLowerCase())
  ) as Item[];
}

export function getItemsEqualToName(name: string) {
  return items.filter(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  ) as Item[];
}

export function getItemEqualToName(name: string) {
  return (items as Item[]).find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
}

export function getItemsNotEqualToName(name: string) {
  return items.filter(
    (item) => item.name.toLowerCase() !== name.toLowerCase()
  ) as Item[];
}

export function getBuyableItems() {
  return items.filter((item) => item.cost) as Item[];
}

export function getVisionItems() {
  return items.filter((item) => item.tags.includes("Vision")) as Item[];
}
export function getCrestItems() {
  return items.filter((item) => item.tags.includes("Crest")) as Item[];
}
export function getTier1Items() {
  return items.filter((item) =>
    item.cost ? item.cost === 350 : false
  ) as Item[];
}
export function getTier2Items() {
  return items.filter((item) =>
    item.cost ? item.cost >= 600 && item.cost <= 1800 : false
  ) as Item[];
}

export function getTier3Items() {
  return items.filter((item) =>
    item.cost ? item.cost >= 2600 : false
  ) as Item[];
}

export function getItemsByNameArray(names: string[]) {
  const itemsArr: Item[] = [];
  //NOTE: Could do a .map & .filter here, but seems easier to only populate with found item names
  names.forEach((name) => {
    const item = getItemEqualToName(name);
    if (item) {
      itemsArr.push(item);
    }
  });
  return itemsArr;
}
