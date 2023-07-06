import { NextResponse } from "next/server";

import { prisma } from "src/app/db/db";

export async function GET(request: Request, { params }: { params: { firebaseUserId: string } }) {
  const { firebaseUserId } = params;
  if (!firebaseUserId) return NextResponse.json({ error: "firebaseUserId not there!" });
  const userRole = await getUserRole(firebaseUserId);
  if (userRole) {
    return NextResponse.json(userRole);
  }
  return NextResponse.json({ error: "userRole not found!" });
}

const getUserRole = async (firebaseUserId: string) => {
  try {
    return await prisma.userRole.findFirst({
      where: { firebaseUserId: firebaseUserId },
      include: { role: true },
    });
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect;
  }
};
