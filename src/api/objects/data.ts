import { subMinutes, subSeconds } from "date-fns";
import { RentalObject } from "src/types/object";

const now = new Date();

export const objects: RentalObject[] = [
  {
    id: "5ecb8a6d9f53bfae09e16116",
    createdAt: subMinutes(subSeconds(now, 23), 32).getTime(),
    name: "Weißes Haus",
    areaSize: 250,
    address: "Kreuzkamp",
    houseNr: 5,
    postalCode: "43834",
    city: "Ahaus",
    image: "src",
    renter: [
      {
        id: "5ecb8a6d9f53bfae09e16117",
        image: "src",
        createdAt: subMinutes(subSeconds(now, 23), 32).getTime(),
        email: "carson.darrin@devias.io",
        name: "Carson Darrin",
      },
    ],
    rentInfo: {
      id: "123123",
      baseRent: 230,
      heatingCosts: 130,
    },
    status: "uninhabited",
  },
  {
    id: "5ecb8a6d9f53bfae09e16118",
    createdAt: 1664813832674,
    name: "Green Villa",
    areaSize: 180,
    address: "Park Lane",
    houseNr: 10,
    postalCode: "12345",
    city: "London",
    image: "src",
    renter: [
      {
        id: "5ecb8a6d9f53bfae09e16115",
        image: "src",
        createdAt: 1664813832674,
        email: "emma.smith@example.com",
        name: "Emma Smith",
      },
    ],
    rentInfo: {
      id: "456789",
      baseRent: 350,
      heatingCosts: 100,
    },
    status: "uninhabited",
  },
  {
    id: "5ecb8a6d9f53bfae09e16110",
    createdAt: 1664813832674,
    name: "Blue Cottage",
    areaSize: 120,
    address: "Seaside Road",
    houseNr: 25,
    postalCode: "98765",
    city: "Beachville",
    image: "src",
    renter: [
      {
        id: "5ecb8a6d9f53bfae09e16115",
        image: "src",
        createdAt: 1664813832674,
        email: "john.doe@example.com",
        name: "John Doe",
      },
      {
        id: "5ecb8a6d9f53bfae09e16116",
        image: "src",
        createdAt: 1664813832674,
        email: "jane.smith@example.com",
        name: "Jane Smith",
      },
    ],
    rentInfo: {
      id: "789012",
      baseRent: 200,
      heatingCosts: 80,
    },
    status: "uninhabited",
  },
];
