const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      },
      {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      },
      {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      },
    ]
  });

  console.log({ users });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
