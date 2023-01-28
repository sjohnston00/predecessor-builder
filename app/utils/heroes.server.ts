import { prisma } from "./prisma.server";

export async function getAllHeroes() {
  return await prisma.hero.findMany({
    include: {
      abilities: true,
      builds: true
    }
  });
}

export async function heroExistByName(heroName: string) {
  const heroWithName = await prisma.hero.count({
    where: {
      name: { equals: heroName, mode: "insensitive" }
    }
  });

  if (!heroWithName) {
    return false;
  }
  return true;
}

export async function getHeroByName(name: string) {
  return await prisma.hero.findFirst({
    where: {
      name: { mode: "insensitive", equals: name }
    },
    include: {
      abilities: true,
      builds: true
    }
  });
}
