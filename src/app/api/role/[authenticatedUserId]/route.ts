import { NextResponse } from "next/server";

import { prisma } from "src/app/db/db";

type Params = { authenticatedUserId: string };

export async function GET(request: Request, context: { params: Promise<Params> }) {
  const { authenticatedUserId } = await context.params;
  if (!authenticatedUserId) return NextResponse.json({ error: "authenticatedUserId not there!" });
  const userRole = await getUserRole(authenticatedUserId);
  if (userRole) {
    return NextResponse.json(userRole);
  }
  return NextResponse.json({ error: "userRole not found!" });
}

const getUserRole = async (authenticatedUserId: string) => {
  try {
    return await prisma.userRole.findFirst({
      where: { authenticatedUserId: authenticatedUserId },
      include: { role: true },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};
