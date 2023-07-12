import { PrismaClient } from "@prisma/client";
import { landlords, rentalObjectInfos, repairRequests, role, userRole } from "./seedData";

const prisma = new PrismaClient();

async function main() {
  await prisma.repairRequest.deleteMany(); //first delete the refernces

  await prisma.rentalObject.deleteMany(); //then the object

  // await prisma.landlord.deleteMany();
  await prisma.renter.deleteMany();
  await prisma.rentalObjectInfo.deleteMany();

  await prisma.userRole.deleteMany();
  // await prisma.role.deleteMany();

  await prisma.repairRequest.createMany({
    data: repairRequests,
  });

  await prisma.rentalObjectInfo.createMany({
    data: rentalObjectInfos,
  });

  await prisma.userRole.createMany({
    data: userRole,
  });

  await prisma.renter.create({
    data: {
      id: "0fc15dda-0ae3-11ee-be56-0242ac120002",
      firebaseUserId: "BeispielfirebaseId1",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      firstname: "John",
      surname: "Doe",
      email: "john.doe@exampleeee.com",
      image: "https://example.com/john-doe.jpg",
      landlords: {
        connect: [{ id: "876e8c7c-3488-4919-9920-d49f3b5bd3db" }],
      },
    },
  });

  await prisma.renter.create({
    data: {
      id: "0fc15dda-0ae3-11ee-be56-0242ac130008",
      firebaseUserId: "BeispielfirebaseId2",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      firstname: "Sarmad",
      surname: "Doe",
      email: "sarmad.doe@exampleeee.com",
      image: "https://example.com/john-doe.jpg",
      landlords: {
        connect: [{ id: "876e8c7c-3488-4919-9920-d49f3b5bd3db" }],
      },
    },
  });

  await prisma.renter.create({
    data: {
      id: "0fc15dda-0ae3-11ee-be56-0242ac130015",
      firebaseUserId: "BeispielfirebaseId3",
      createdAt: new Date("2023-06-01T12:00:00Z"),
      firstname: "Hamza",
      surname: "Doe",
      email: "hamza.doe@exampleeee.com",
      image: "https://example.com/john-doe.jpg",
      landlords: {
        connect: [{ id: "876e8c7c-3488-4919-9920-d49f3b5bd3db" }],
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
      landlordId: "876e8c7c-3488-4919-9920-d49f3b5bd3db",
      renter: {
        connect: [{ id: "0fc15dda-0ae3-11ee-be56-0242ac120002" }, { id: "0fc15dda-0ae3-11ee-be56-0242ac130008" }],
      },
      repairRequests: {
        connect: [{ id: "20f9fbe2-0855-11ee-be56-0242ac120009" }],
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
      landlordId: "876e8c7c-3488-4919-9920-d49f3b5bd3db",
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

  await prisma.role.createMany({
    data: role,
  });
  await prisma.landlord.createMany({
    data: landlords,
  });
}

main().finally(async () => await prisma.$disconnect());
