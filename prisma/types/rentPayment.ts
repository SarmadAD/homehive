import { Prisma } from "@prisma/client";

// 1: Define a type that includes the relation to `Post`
const rentPayment = Prisma.validator<Prisma.RentPaymentArgs>()({
  include: { rentalObject: true, renter: true },
});

// // 2: Define a type that only contains a subset of the scalar fields
// const userPersonalData = Prisma.validator<Prisma.UserArgs>()({
//   select: { email: true, name: true },
// });

// 3: This type will include a user and all their posts
export type RentPayment = Prisma.RentPaymentGetPayload<typeof rentPayment>;
