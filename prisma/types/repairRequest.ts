import { Prisma } from "@prisma/client";

const repairRequest = Prisma.validator<Prisma.RepairRequestDefaultArgs>()({
  include: { renter: true },
});

export type RepairRequest = Prisma.RepairRequestGetPayload<typeof repairRequest>;
