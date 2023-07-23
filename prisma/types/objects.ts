import { Prisma, RentalObjectStatus } from "@prisma/client";

// 1: Define a type that includes the relation to `Post`
const rentalObject = Prisma.validator<Prisma.RentalObjectArgs>()({
  include: {
    renter: { include: { rentalObject: true, rentalAgreement: true, rentPayment: true } },
    rentalAgreement: { include: { renter: true, rentalObject: true } },
    landlord: true,
    rentalObjectInfo: true,
    repairRequests: true,
    rentPayment: { include: { renter: true, rentalObject: true } },
  },
});

// // 2: Define a type that only contains a subset of the scalar fields
// const userPersonalData = Prisma.validator<Prisma.UserArgs>()({
//   select: { email: true, name: true },
// });

// 3: This type will include a user and all their posts
export type RentalObject = Prisma.RentalObjectGetPayload<typeof rentalObject>;

export const rentalObjectDefault: RentalObject = {
  id: "",
  createdAt: new Date(),
  name: "",
  image: "",
  status: RentalObjectStatus.UNINHABITED,
  address: "",
  houseNr: 0,
  additionalHouseDetails: "",
  city: "",
  postalCode: "",
  areaSize: 0,
  renter: [],
  rentPayment: [],
  repairRequests: [],
  rentalAgreement: [],
  rentalObjectInfo: {
    id: "",
    baseRent: 0,
    electricityCosts: 0,
    heatingCosts: 0,
    waterCosts: 0,
  },
  rentalObjectInfoId: "",
  landlord: {
    id: "",
    firebaseUserId: "",
  },
  landlordId: "",
};
