import { subMinutes, subSeconds } from "date-fns";
import { RentalObject } from "src/types/object";
import { RepairRequest } from "src/types/repairRequest";

const now = new Date();

export const repairRequests: RepairRequest[] = [
  {
    id: "5ecb8a6d9f53bfae09e16142",
    createdAt: subMinutes(subSeconds(now, 23), 32).getTime(),
    name: "Fenster kaputt",
    status: "done",
    comment: "halllooo",
    renter: {
      id: "5ecb8a6d9f53bfae09e16117",
      image: "src",
      createdAt: subMinutes(subSeconds(now, 23), 32).getTime(),
      email: "carson.darrin@devias.io",
      name: "Carson Darrin",
      status: "paid",
    },
  },
  {
    id: "5ecb8a6d9f53bfae09e16143",
    createdAt: subMinutes(subSeconds(now, 23), 32).getTime(),
    name: "Garage kaputt",
    status: "inProgress",
    comment: "halllooo",
    renter: {
      id: "5ecb8a6d9f53bfae09e16117",
      image: "src",
      createdAt: subMinutes(subSeconds(now, 23), 32).getTime(),
      email: "carson.darrin@devias.io",
      name: "Carson Darrin",
      status: "paid",
    },
  },
];
