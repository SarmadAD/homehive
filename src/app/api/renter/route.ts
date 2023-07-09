import { NextRequest, NextResponse } from "next/server";

import { prisma } from "src/app/db/db";

export async function GET(request: NextRequest) {
  const firebaseUserId = request.nextUrl.searchParams.get("fbId");
  if (!firebaseUserId) return NextResponse.json({ error: "firebaseUserId not there!" });
  const renter = await getRenter(firebaseUserId);
  if (renter) {
    return NextResponse.json(renter);
  }
  return NextResponse.json({ error: "renter not found!" });
}

const getRenter = async (firebaseUserId: string) => {
  try {
    return await prisma.renter.findFirst({
      where: { firebaseUserId: firebaseUserId },
      include: { rentalObject: true },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect;
  }
};
