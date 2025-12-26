import { NextResponse } from "next/server";

import { prisma } from "src/app/db/db";

export async function GET(request: Request, context: { params: { authenticatedUserId: string } }) {
  const { authenticatedUserId } = context.params;
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
