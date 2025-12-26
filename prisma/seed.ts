import { PrismaClient, Prisma, Landlord, RentalObject, Renter, Role } from "@prisma/client";

const prisma = new PrismaClient();

const getRenter = (landLords: Landlord[]): Prisma.RenterCreateInput[] => [
  {
    authenticatedUserId: "c0c1d309-ede3-4d83-bbe8-dabe8c94857b",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    firstname: "John",
    surname: "Doe",
    email: "john.doe@exampleeee.com",
    image: "https://example.com/john-doe.jpg",
    landlords: {
      connect: [{ id: landLords[0].id }],
    },
  },
  {
    authenticatedUserId: "BeispielId2",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    firstname: "Sarmad",
    surname: "Doe",
    email: "sarmad.doe@exampleeee.com",
    image: "https://example.com/john-doe.jpg",
    landlords: {
      connect: [{ id: landLords[0].id }],
    },
  },
  {
    authenticatedUserId: "BeispielId3",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    firstname: "Hamza",
    surname: "Doe",
    email: "hamza.doe@exampleeee.com",
    image: "https://example.com/john-doe.jpg",
    landlords: {
      connect: [{ id: landLords[0].id }],
    },
  },
];

const getRentalObject = (landlords: Landlord[]): Prisma.RentalObjectCreateInput[] => [
  {
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "Apartment 1",
    image: "https://example.com/image1.jpg",
    address: "123 Main Street",
    houseNr: 1,
    additionalHouseDetails: "Apartment 1 additional details",
    city: "City",
    postalCode: 12345,
    areaSize: 100,
    landlord: { connect: { id: landlords[0].id } },
  },
  {
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "Apartment 2",
    image: "https://example.com/image1.jpg",
    address: "123 Main Street",
    houseNr: 1,
    additionalHouseDetails: "Apartment 1 additional details",
    city: "City",
    postalCode: 12345,
    areaSize: 100,
    landlord: { connect: { id: landlords[0].id } },
  },
];

const getLandLords = (): Prisma.LandlordCreateInput[] => [
  {
    authenticatedUserId: "LAg5mcTtMKZU0AVbymt7V4Ut9Cx1",
  },
];

const getRepairRequests = (renter: Renter, rentalObject: RentalObject): Prisma.RepairRequestCreateInput[] => [
  {
    id: "20f9fbe2-0855-11ee-be56-0242ac120002",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "Broken faucet",
    status: "REQUESTED",
    comment: "The faucet in the kitchen is leaking.",
    renter: { connect: { id: renter.id } },
    RentalObject: { connect: { id: rentalObject.id } },
  },
  {
    id: "20f9fbe2-0855-11ee-be56-0242ac120009",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "Broken Window",
    status: "REQUESTED",
    comment: "The windows in the kitchen is broken.",
    renter: { connect: { id: renter.id } },
    RentalObject: { connect: { id: rentalObject.id } },
  },
];

const getRoles = (): Prisma.RoleCreateInput[] => [
  { id: "20f9fbe2-0855-11ee-be56-0242ac120044", role: "Renter" },
  { id: "20f9fbe2-0855-11ee-be56-0242ac120055", role: "Landlord" },
];

const getUserRole = (roles: Role[]): Prisma.UserRoleCreateInput[] => [
  {
    authenticatedUserId: "beispielId",
    role: { connect: { id: roles[0].id } },
  },
  {
    authenticatedUserId: "beispielId",
    role: { connect: { id: roles[0].id } },
  },
  {
    authenticatedUserId: "LAg5mcTtMKZU0AVbymt7V4Ut9Cx1",
    role: { connect: { id: roles[1].id } },
  },
];

async function main() {
  await prisma.repairRequest.deleteMany(); //first delete the refernces

  await prisma.rentPayment.deleteMany();
  await prisma.rentalAgreement.deleteMany();

  await prisma.rentalObject.deleteMany(); //then the object

  await prisma.landlord.deleteMany();
  await prisma.renter.deleteMany();

  await prisma.userRole.deleteMany();
  await prisma.role.deleteMany();

  // Erstelle die Rollen
  const roles = await Promise.all(getRoles().map((role) => prisma.role.create({ data: role })));

  const landlords = await Promise.all(getLandLords().map((landlord) => prisma.landlord.create({ data: landlord })));
  const renters = await Promise.all(getRenter(landlords).map((renter) => prisma.renter.create({ data: renter })));

  const rentalObjects = await Promise.all(getRentalObject(landlords).map((rentalObject) => prisma.rentalObject.create({ data: rentalObject })));
  const repairRequests = await Promise.all(
    getRepairRequests(renters[0], rentalObjects[0]).map((repairRequest) => prisma.repairRequest.create({ data: repairRequest }))
  );

  // Erstelle die UserRoles
  const userRoles = await Promise.all(getUserRole(roles).map((userRole) => prisma.userRole.create({ data: userRole })));

  // await prisma.repairRequest.deleteMany(); //first delete the refernces

  // await prisma.rentPayment.deleteMany();
  // await prisma.rentalAgreement.deleteMany();

  // await prisma.rentalObject.deleteMany(); //then the object

  // // // await prisma.landlord.deleteMany();
  // await prisma.renter.deleteMany();

  // await prisma.rentalObjectInfo.deleteMany();

  // // await prisma.userRole.deleteMany();
  // // await prisma.role.deleteMany();

  // // await prisma.role.createMany({
  // //   data: role,
  // // });
  // // await prisma.landlord.createMany({
  // //   data: landlords,
  // // });
  // // await prisma.repairRequest.createMany({
  // //   data: repairRequests,
  // // });

  // await prisma.rentalObjectInfo.createMany({
  //   data: rentalObjectInfos,
  // });

  // await prisma.userRole.createMany({
  //   data: userRole,
  // });

  // await prisma.renter.create({
  //   data: {
  //     id: "0fc15dda-0ae3-11ee-be56-0242ac120002",
  //     authenticatedUserId: "BeispielId1",
  //     createdAt: new Date("2023-06-01T12:00:00Z"),
  //     firstname: "John",
  //     surname: "Doe",
  //     email: "john.doe@exampleeee.com",
  //     image: "https://example.com/john-doe.jpg",
  //     landlords: {
  //       connect: [{ id: "c2ba0be5-30c5-432c-9f64-f2a989ff70bc" }],
  //     },
  //     rentPayment: {
  //       createMany: {
  //         data: [
  //           {
  //             paymentAmount: 1000,
  //             dueDate: new Date("2023-06-01T12:00:00Z"),
  //             paymentDate: new Date("2023-06-01T12:00:00Z"),
  //             status: "PAID",
  //             rentalObjectId: "e467a9e6-0ae2-11ee-be56-0242ac120002",
  //           },
  //           {
  //             paymentAmount: 2000,
  //             dueDate: new Date("2023-07-01T12:00:00Z"),
  //             paymentDate: new Date("2023-07-01T12:00:00Z"),
  //             status: "PAID",
  //             rentalObjectId: "e467a9e6-0ae2-11ee-be56-0242ac120002",
  //           },
  //           {
  //             paymentAmount: 1000,
  //             dueDate: new Date("2023-08-01T12:00:00Z"),
  //             paymentDate: new Date("2023-08-01T12:00:00Z"),
  //             status: "PAID",
  //             rentalObjectId: "e467a9e6-0ae2-11ee-be56-0242ac120002",
  //           },
  //         ],
  //       },
  //     },
  //   },
  // });

  // await prisma.renter.create({
  //   data: {
  //     id: "0fc15dda-0ae3-11ee-be56-0242ac130008",
  //     authenticatedUserId: "BeispielId2",
  //     createdAt: new Date("2023-06-01T12:00:00Z"),
  //     firstname: "Sarmad",
  //     surname: "Doe",
  //     email: "sarmad.doe@exampleeee.com",
  //     image: "https://example.com/john-doe.jpg",
  //     landlords: {
  //       connect: [{ id: "c2ba0be5-30c5-432c-9f64-f2a989ff70bc" }],
  //     },
  //     rentPayment: {
  //       createMany: {
  //         data: [
  //           {
  //             paymentAmount: 1000,
  //             dueDate: new Date("2023-06-01T12:00:00Z"),
  //             paymentDate: new Date("2023-06-01T12:00:00Z"),
  //             status: "PAID",
  //             rentalObjectId: "21fd5324-0ae2-11ee-be56-0242ac120002",
  //           },
  //           {
  //             paymentAmount: 2000,
  //             dueDate: new Date("2023-07-01T12:00:00Z"),
  //             paymentDate: new Date("2023-07-01T12:00:00Z"),
  //             status: "PAID",
  //             rentalObjectId: "21fd5324-0ae2-11ee-be56-0242ac120002",
  //           },
  //         ],
  //       },
  //     },
  //   },
  // });

  // await prisma.renter.create({
  //   data: {
  //     id: "0fc15dda-0ae3-11ee-be56-0242ac130015",
  //     authenticatedUserId: "BeispielId3",
  //     createdAt: new Date("2023-06-01T12:00:00Z"),
  //     firstname: "Hamza",
  //     surname: "Doe",
  //     email: "hamza.doe@exampleeee.com",
  //     image: "https://example.com/john-doe.jpg",
  //     landlords: {
  //       connect: [{ id: "c2ba0be5-30c5-432c-9f64-f2a989ff70bc" }],
  //     },
  //   },
  // });

  //   await prisma.rentalObject.create({
  //     data: {
  //       id: "e467a9e6-0ae2-11ee-be56-0242ac120002",
  //       createdAt: new Date("2023-06-01T12:00:00Z"),
  //       name: "Apartment 1",
  //       image: "https://example.com/image1.jpg",
  //       status: "INHABITED",
  //       address: "123 Main Street",
  //       houseNr: 1,
  //       additionalHouseDetails: "Apartment 1 additional details",
  //       city: "City",
  //       postalCode: "12345",
  //       areaSize: 100,
  //       landlordId: "c2ba0be5-30c5-432c-9f64-f2a989ff70bc",
  //       rentalObjectInfoId: "fe7743a0-0ae2-11ee-be56-0242ac120002",
  //       renter: {
  //         connect: [{ id: "0fc15dda-0ae3-11ee-be56-0242ac120002" }, { id: "0fc15dda-0ae3-11ee-be56-0242ac130008" }],
  //       },
  //       // repairRequests: {
  //       //   connect: [{ id: "20f9fbe2-0855-11ee-be56-0242ac120009" }],
  //       // },
  //     },
  //     include: {
  //       renter: true,
  //       repairRequests: true,
  //       rentalObjectInfo: true,
  //     },
  //   });

  //   await prisma.rentalObject.create({
  //     data: {
  //       id: "21fd5324-0ae2-11ee-be56-0242ac120002",
  //       createdAt: new Date("2023-06-01T12:00:00Z"),
  //       name: "Apartment 2",
  //       image: "https://example.com/image1.jpg",
  //       status: "UNINHABITED",
  //       address: "123 Main Street",
  //       houseNr: 1,
  //       additionalHouseDetails: "Apartment 1 additional details",
  //       city: "City",
  //       postalCode: "12345",
  //       areaSize: 100,
  //       rentalObjectInfoId: "81b2bd44-0ae3-11ee-be56-0242ac120002",
  //       landlordId: "c2ba0be5-30c5-432c-9f64-f2a989ff70bc",
  //       renter: {
  //         connect: [{ id: "0fc15dda-0ae3-11ee-be56-0242ac130008" }],
  //       },
  //       // repairRequests: {
  //       //   connect: [{ id: "20f9fbe2-0855-11ee-be56-0242ac120002" }],
  //       // },
  //     },
  //     include: {
  //       renter: true,
  //       repairRequests: true,
  //       rentalObjectInfo: true,
  //     },
  //   });
}

main().finally(async () => await prisma.$disconnect()());
