import { Prisma } from "@prisma/client";

const rentalAgreement = Prisma.validator<Prisma.RentalAgreementDefaultArgs>()({
  include: { renter: true, rentalObject: { include: { renter: true } } },
});

export type RentalAgreement = Prisma.RentalAgreementGetPayload<typeof rentalAgreement>;
