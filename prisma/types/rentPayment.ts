import { Prisma } from "@prisma/client";

const rentPayment = Prisma.validator<Prisma.RentPaymentDefaultArgs>()({
  include: { rentalObject: true, renter: true },
});

export type RentPayment = Prisma.RentPaymentGetPayload<typeof rentPayment>;
