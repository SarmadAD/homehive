import { Landlord, RentalObject, RentalObjectInfo, Renter, RepairRequest } from "@prisma/client";

const rentalObjects: RentalObject[] = [
  {
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
    rentalObjectInfoId: "fe7743a0-0ae2-11ee-be56-0242ac120002",
    landlordId: "04e35c74-0ae3-11ee-be56-0242ac120002",
  },
  {
    id: "21fd5324-0ae2-11ee-be56-0242ac120002",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "Apartment 2",
    image: "https://example.com/image1.jpg",
    status: "INHABITED",
    address: "123 Main Street",
    houseNr: 1,
    additionalHouseDetails: "Apartment 1 additional details",
    city: "City",
    postalCode: "12345",
    areaSize: 100,
    rentalObjectInfoId: "81b2bd44-0ae3-11ee-be56-0242ac120002",
    landlordId: "04e35c74-0ae3-11ee-be56-0242ac120002",
  },
];

const renters: Renter[] = [
  {
    id: "0fc15dda-0ae3-11ee-be56-0242ac120002",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "John Doe",
    status: "PAID",
    email: "john.doe@exampleeee.com",
    image: "https://example.com/john-doe.jpg",
    rentalObjectId: "e467a9e6-0ae2-11ee-be56-0242ac120002",
  },
];

const landlords: Landlord[] = [
  {
    id: "04e35c74-0ae3-11ee-be56-0242ac120002",
    firebaseUserId: "aHVAVJTNzOQgvyHXW0wMOZLbLXK2",
  },
];

const rentalObjectInfos: RentalObjectInfo[] = [
  {
    id: "fe7743a0-0ae2-11ee-be56-0242ac120002",
    baseRent: 1000,
    heatingCosts: 100,
    waterCosts: 50,
    electricityCosts: 75,
  },
  {
    id: "81b2bd44-0ae3-11ee-be56-0242ac120002",
    baseRent: 2000,
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
    renterId: "0fc15dda-0ae3-11ee-be56-0242ac120002",
    rentalObjectId: "e467a9e6-0ae2-11ee-be56-0242ac120002",
  },
];

export { rentalObjects, renters, rentalObjectInfos, repairRequests, landlords };
