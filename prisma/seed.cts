import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()
async function main() {
  //CREATE ROLES
  const userRole = await prisma.role.upsert({
    where: { name: "User" },
    update: {},
    create: {
      name: "User",
    },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
    },
  })

  //CREATE USER
  const testUsername = "test"
  const testEmail = "test@test.com"
  const testerPasswordHash = await bcrypt.hash("Tester0!", 10)
  const test = await prisma.user.upsert({
    where: { email: testEmail },
    update: {},
    create: {
      email: testEmail,
      username: testUsername,
      roleId: adminRole.roleId,
    },
  })

  //CREATE PASSWORD
  await prisma.userPassword.upsert({
    where: {
      userId: test.userId,
    },
    update: {},
    create: {
      userId: test.userId,
      passwordHash: testerPasswordHash,
    },
  })

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
    users: [test],
    roles: [userRole, adminRole],
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
