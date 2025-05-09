import { Prisma } from "@prisma/client";

const renter = Prisma.validator<Prisma.RenterDefaultArgs>()({
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

export type Renter = Prisma.RenterGetPayload<typeof renter>;

export const renterDefault: Renter = {
  id: "",
  createdAt: new Date(),
  state: 1,
  firstname: "",
  surname: "",
  image: "",
  email: "",
  authenticatedUserId: "",
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
  },
  rentalObjectId: "",
};
