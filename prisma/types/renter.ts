import { Prisma } from "@prisma/client";
import { rentalAgreementDefault } from "./rentalAgreement";
import { rentalObjectDefault } from "./objects";

const renter = Prisma.validator<Prisma.RenterDefaultArgs>()({
  include: {
    rentalObject: {
      include: {
        renter: { include: { rentalAgreement: true, rentalObject: true } },
        repairRequests: true,
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
  rentalObject: rentalObjectDefault,
  rentalObjectId: "",
  rentalAgreement: rentalAgreementDefault,
};
