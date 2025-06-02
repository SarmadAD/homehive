import { Prisma } from "@prisma/client";
import { defaultLandlord } from "./landlord";

const rentalObject = Prisma.validator<Prisma.RentalObjectDefaultArgs>()({
  include: {
    renter: { include: { rentalObject: true, rentalAgreement: true, rentPayment: true } },
    rentalAgreement: { include: { renter: true, rentalObject: true } },
    landlord: true,
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
  landlord: defaultLandlord,
  landlordId: "",
};

export enum RentalObjectStatus {
  INHABITED = "INHABITED",
  UNINHABITED = "UNINHABITED",
}
