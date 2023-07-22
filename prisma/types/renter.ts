import { Prisma, RentalObjectStatus } from "@prisma/client";

// 1: Define a type that includes the relation to `Post`
const renter = Prisma.validator<Prisma.RenterArgs>()({
  include: {
    rentalObject: {
      include: {
        renter: { include: { rentalAgreement: true, rentalObject: true } },
        repairRequests: true,
        rentalObjectInfo: true,
        landlord: true,
        rentalAgreement: true,
      },
    },
    rentalAgreement: true,
    rentPayment: { include: { rentalObject: true } },
  },
});

// // 2: Define a type that only contains a subset of the scalar fields
// const userPersonalData = Prisma.validator<Prisma.UserArgs>()({
//   select: { email: true, name: true },
// });

// 3: This type will include a user and all their posts
export type Renter = Prisma.RenterGetPayload<typeof renter>;

export const renterDefault: Renter = {
  id: "",
  createdAt: new Date(),
  firstname: "",
  surname: "",
  image: "",
  email: "",
  firebaseUserId: "",
  rentalAgreementId: "",
  rentPayment: [],
  rentalAgreement: {
    id: "",
    rentalObjectId: "",
    dueDateState: "FIRSTMONTH",
  },
  rentalObject: {
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
  },
  rentalObjectId: "",
};
