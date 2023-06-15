import { PrismaClient } from "@prisma/client";
import { landlords, rentalObjects, renters } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  await prisma.rentalObject.deleteMany();
  await prisma.landlord.deleteMany();
  await prisma.renter.deleteMany();

  await prisma.rentalObject.createMany({
    data: rentalObjects,
  });
  await prisma.landlord.createMany({
    data: landlords,
  });
  await prisma.renter.createMany({
    data: renters,
  });
}

main().finally(async () => await prisma.$disconnect());
