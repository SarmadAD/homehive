import { Landlord, RentalObject, RentalObjectInfo, Renter, RepairRequest } from "@prisma/client";

const rentalObjects: RentalObject[] = [
  {
    id: "0e20008e-0855-11ee-be56-0242ac120002",
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
    rentalObjectInfoId: "1a58a6f8-0855-11ee-be56-0242ac120002",
    landlordId: "9b9b9472-0ae0-11ee-be56-0242ac120002",
  },
];

const renters: Renter[] = [
  {
    id: "1358a0ce-0855-11ee-be56-0242ac120002",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "John Doe",
    status: "PAID",
    email: "john.doe@example.com",
    image: "https://example.com/john-doe.jpg",
    rentalObjectId: "0e20008e-0855-11ee-be56-0242ac120002",
  },
];

const landlord: Landlord[] = [
  {
    id: "9b9b9472-0ae0-11ee-be56-0242ac120002",
  },
];

const rentalObjectInfos: RentalObjectInfo[] = [
  {
    id: "1a58a6f8-0855-11ee-be56-0242ac120002",
    baseRent: 1000,
    heatingCosts: 100,
    waterCosts: 50,
    electricityCosts: 75,
  },
];

const repairRequests: RepairRequest[] = [
  {
    id: "20f9fbe2-0855-11ee-be56-0242ac120002",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "Broken faucet",
    status: "REQUESTED",
    comment: "The faucet in the kitchen is leaking.",
    renterId: "1358a0ce-0855-11ee-be56-0242ac120002",
    rentalObjectId: "0e20008e-0855-11ee-be56-0242ac120002",
  },
];

export { rentalObjects, renters, rentalObjectInfos, repairRequests };
