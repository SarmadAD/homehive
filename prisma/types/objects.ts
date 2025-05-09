import { Prisma } from "@prisma/client";

const rentalObject = Prisma.validator<Prisma.RentalObjectDefaultArgs>()({
  include: {
    renter: { include: { rentalObject: true, rentalAgreement: true, rentPayment: true } },
    rentalAgreement: { include: { renter: true, rentalObject: true } },
    landlord: true,
    rentalObjectInfo: true,
    repairRequests: true,
    rentPayment: { include: { renter: true, rentalObject: true } },
  },
});

export type RentalObject = Prisma.RentalObjectGetPayload<typeof rentalObject>;

export const rentalObjectDefault: RentalObject = {
  id: "",
  createdAt: new Date(),
  state: 1,
  name: "",
  image: "",
  address: "",
  houseNr: 0,
  additionalHouseDetails: "",
  city: "",
  postalCode: 0,
  areaSize: 0,
  renter: [],
  rentPayment: [],
  repairRequests: [],
  rentalAgreement: [],
  rentalObjectInfo: {
    id: "",
    baseRent: 0,
    serviceCharges: 0,
    electricityCosts: 0,
    heatingCosts: 0,
    waterCosts: 0,
  },
  rentalObjectInfoId: "",
  landlord: {
    id: "",
    authenticatedUserId: "",
    customerId: "",
    hasAccess: false,
    priceId: "",
  },
  landlordId: "",
};

export enum RentalObjectStatus {
  INHABITED = "INHABITED",
  UNINHABITED = "UNINHABITED",
}
