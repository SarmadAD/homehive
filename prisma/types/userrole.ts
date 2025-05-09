import { Prisma } from "@prisma/client";

const userRole = Prisma.validator<Prisma.UserRoleDefaultArgs>()({
  include: { role: true },
});

export type UserRole = Prisma.UserRoleGetPayload<typeof userRole>;
