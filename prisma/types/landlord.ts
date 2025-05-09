import { Prisma } from "@prisma/client";

const landlord = Prisma.validator<Prisma.LandlordDefaultArgs>()({
  include: { rentPayments: { include: { rentalObject: true, renter: true } } },
});

export type Landlord = Prisma.LandlordGetPayload<typeof landlord>;

export const defaultLandlord: Landlord = {
  id: "",
  authenticatedUserId: "",
  customerId: "",
  hasAccess: false,
  priceId: "",
  rentPayments: [],
};
