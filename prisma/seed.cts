import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()
async function main() {
  const heroes = await prisma.hero.count()
  if (heroes === 0) {
    const heroNames = [
      "Gideon",
      "Steel",
      "Grux",
      "Rampage",
      "Crunch",
      "Dekker",
      "Sparrow",
      "Drongo",
      "Murdock",
      "Narbash",
      "Lt. Bellica",
      "Muriel",
      "Sevaroq",
    ]
    await prisma.hero.createMany({
      data: heroNames.map((name) => ({
        name: name,
      })),
    })
  }

  //CREATE HEROES
  console.log({
    heroes,
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
