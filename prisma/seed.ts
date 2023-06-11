import { PrismaClient } from "@prisma/client";
import { rentalObjects } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  const rentalObjectsData = [];
  // await prisma.rentalObject.deleteMany();
  for (const rentalObject of rentalObjects) {
    rentalObjectsData.push(
      prisma.rentalObject.create({
        data: {
          address: rentalObject.address,
          areaSize: rentalObject.areaSize,
          name: rentalObject.name,
          image: rentalObject.image,
          status: rentalObject.status,
          houseNr: rentalObject.houseNr,
          additionalHouseDetails: rentalObject.additionalHouseDetails,
          city: rentalObject.city,
          postalCode: rentalObject.postalCode,
          rentalObjectInfoId: rentalObject.rentalObjectInfoId,
          renter: {
            create: {
              createdAt: new Date("2023-06-01T12:00:00Z"),
              name: "John Doe",
              status: "PAID",
              email: "john.doe@exampla.com",
              image: "https://example.com/john-doe.jpg",
            },
          },
        },
        include: { renter: true },
      })
    );
  }
  await prisma.$transaction(rentalObjectsData);
}

main().finally(async () => await prisma.$disconnect());
