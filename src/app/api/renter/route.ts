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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { renters, rentalObjectId } = body;

    if (!renters || !Array.isArray(renters) || renters.length === 0) {
      return NextResponse.json({ error: "Invalid or missing renters array" });
    }

    if (!rentalObjectId) {
      return NextResponse.json({ error: "rentalObjectId is required" });
    }

    const updatedRenters = await prisma.renter.updateMany({
      where: {
        id: { in: renters },
        rentalObjectId: rentalObjectId,
      },
      data: { rentalObjectId: null },
    });

    // Check if there are any renters left for the rentalObject
    const remainingRenters = await prisma.renter.count({
      where: { rentalObjectId: rentalObjectId },
    });

    // If no renters are left, update the rentalObject status to UNINHIBITED
    if (remainingRenters === 0) {
      await prisma.rentalObject.update({
        where: { id: rentalObjectId },
        data: { status: "UNINHABITED" },
      });
    }

    return NextResponse.json({
      message: "Rental objects updated successfully",
      count: updatedRenters.count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update" });
  } finally {
    await prisma.$disconnect();
  }
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
