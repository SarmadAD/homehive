import { Prisma } from "@prisma/client";
import { renterDefault } from "./renter";
import { rentalObjectDefault } from "./objects";

const rentalAgreement = Prisma.validator<Prisma.RentalAgreementDefaultArgs>()({
  include: { renter: true, rentalObject: { include: { renter: true } } },
});

export type RentalAgreement = Prisma.RentalAgreementGetPayload<typeof rentalAgreement>;

export const rentalAgreementDefault: RentalAgreement = {
  id: "",
  dueDateState: "FIRSTMONTH",
  baseRent: 0,
  serviceCharges: 0,
  landlordId: "",
  rentalObjectId: "",
  rentalObject: rentalObjectDefault,
  renter: null,
  state: 1,
};
