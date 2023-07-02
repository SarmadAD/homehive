import { Landlord, RentalObjectInfo, RepairRequest } from "@prisma/client";

const landlords: Landlord[] = [
  {
    id: "04e35c74-0ae3-11ee-be56-0242ac120002",
    firebaseUserId: "BeispielfirebaseId",
  },
];

const rentalObjectInfos: RentalObjectInfo[] = [
  {
    id: "fe7743a0-0ae2-11ee-be56-0242ac120002",
    baseRent: 1000,
    heatingCosts: 100,
    waterCosts: 50,
    electricityCosts: 75,
    dueDateOfRent: "ENDMONTH",
  },
  {
    id: "81b2bd44-0ae3-11ee-be56-0242ac120002",
    baseRent: 2000,
    heatingCosts: 100,
    waterCosts: 50,
    electricityCosts: 75,
    dueDateOfRent: "ENDMONTH",
  },
];

const repairRequests: RepairRequest[] = [
  {
    id: "20f9fbe2-0855-11ee-be56-0242ac120002",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "Broken faucet",
    status: "REQUESTED",
    comment: "The faucet in the kitchen is leaking.",
    renterId: "0fc15dda-0ae3-11ee-be56-0242ac130015",
    rentalObjectId: "e467a9e6-0ae2-11ee-be56-0242ac120002",
  },
  {
    id: "20f9fbe2-0855-11ee-be56-0242ac120009",
    createdAt: new Date("2023-06-01T12:00:00Z"),
    name: "Broken Window",
    status: "REQUESTED",
    comment: "The windows in the kitchen is broken.",
    renterId: "0fc15dda-0ae3-11ee-be56-0242ac130008",
    rentalObjectId: "e467a9e6-0ae2-11ee-be56-0242ac120002",
  },
];

export { rentalObjectInfos, repairRequests, landlords };
