import { PrismaClient } from "@prisma/client";
import { landlords, rentalObjectInfos, rentalObjects, renters, repairRequests } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  await prisma.repairRequest.deleteMany(); //first delete the refernces

  await prisma.rentalObject.deleteMany(); //then the object

  // await prisma.landlord.deleteMany();
  await prisma.renter.deleteMany();
  await prisma.rentalObjectInfo.deleteMany();

  await prisma.repairRequest.createMany({
    data: repairRequests,
  });

  await prisma.rentalObjectInfo.createMany({
    data: rentalObjectInfos,
  });

  await prisma.renter.create({
    data: {
      id: "0fc15dda-0ae3-11ee-be56-0242ac120002",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      name: "John Doe",
      status: "PAID",
      email: "john.doe@exampleeee.com",
      image: "https://example.com/john-doe.jpg",
      // rentalObject: {
      //   connect: { id: "e467a9e6-0ae2-11ee-be56-0242ac120002" },
      // },
      landlords: {
        connect: [{ id: "2fec6670-bd13-45d2-8bfd-a37bf6f906f8" }],
      },
      repairRequest: {
        connect: [{ id: "20f9fbe2-0855-11ee-be56-0242ac120002" }],
      },
    },
  });

  await prisma.renter.create({
    data: {
      id: "0fc15dda-0ae3-11ee-be56-0242ac130008",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      name: "Sarmad Doe",
      status: "PAID",
      email: "sarmad.doe@exampleeee.com",
      image: "https://example.com/john-doe.jpg",
      // rentalObject: {
      //   connect: { id: "e467a9e6-0ae2-11ee-be56-0242ac120002" },
      // },
      landlords: {
        connect: [{ id: "2fec6670-bd13-45d2-8bfd-a37bf6f906f8" }],
      },
      repairRequest: {
        connect: [{ id: "20f9fbe2-0855-11ee-be56-0242ac120002" }],
      },
    },
  });

  await prisma.renter.create({
    data: {
      id: "0fc15dda-0ae3-11ee-be56-0242ac130015",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      name: "Hamza Doe",
      status: "PAID",
      email: "hamza.doe@exampleeee.com",
      image: "https://example.com/john-doe.jpg",
      // rentalObject: {
      //   connect: { id: "21fd5324-0ae2-11ee-be56-0242ac120002" },
      // },
      landlords: {
        connect: [{ id: "2fec6670-bd13-45d2-8bfd-a37bf6f906f8" }],
      },
      repairRequest: {
        connect: [{ id: "20f9fbe2-0855-11ee-be56-0242ac120002" }],
      },
    },
  });

  await prisma.rentalObject.create({
    data: {
      id: "e467a9e6-0ae2-11ee-be56-0242ac120002",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      name: "Apartment 1",
      image: "https://example.com/image1.jpg",
      status: "INHABITED",
      address: "123 Main Street",
      houseNr: 1,
      additionalHouseDetails: "Apartment 1 additional details",
      city: "City",
      postalCode: "12345",
      areaSize: 100,
      rentalObjectInfoId: "81b2bd44-0ae3-11ee-be56-0242ac120002",
      landlordId: "2fec6670-bd13-45d2-8bfd-a37bf6f906f8",
      renter: {
        connect: [{ id: "0fc15dda-0ae3-11ee-be56-0242ac120002" }, { id: "0fc15dda-0ae3-11ee-be56-0242ac130008" }],
      },
      repairRequests: {
        connect: [{ id: "20f9fbe2-0855-11ee-be56-0242ac120002" }],
      },
    },
    include: {
      renter: true,
      repairRequests: true,
      rentalObjectInfo: true,
    },
  });

  await prisma.rentalObject.create({
    data: {
      id: "21fd5324-0ae2-11ee-be56-0242ac120002",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      name: "Apartment 2",
      image: "https://example.com/image1.jpg",
      status: "UNINHABITED",
      address: "123 Main Street",
      houseNr: 1,
      additionalHouseDetails: "Apartment 1 additional details",
      city: "City",
      postalCode: "12345",
      areaSize: 100,
      rentalObjectInfoId: "fe7743a0-0ae2-11ee-be56-0242ac120002",
      landlordId: "2fec6670-bd13-45d2-8bfd-a37bf6f906f8",
      renter: {
        connect: [{ id: "0fc15dda-0ae3-11ee-be56-0242ac130015" }],
      },
      repairRequests: {
        connect: [{ id: "20f9fbe2-0855-11ee-be56-0242ac120002" }],
      },
    },
    include: {
      renter: true,
      repairRequests: true,
      rentalObjectInfo: true,
    },
  });
  await prisma.landlord.createMany({
    data: landlords,
  });
}

main().finally(async () => await prisma.$disconnect());
