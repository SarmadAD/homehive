import { NextRequest, NextResponse } from "next/server";

import { prisma } from "src/app/db/db";

export async function GET(request: NextRequest) {
  const authenticatedUserId = request.nextUrl.searchParams.get("aId");
  if (!authenticatedUserId) return NextResponse.json({ error: "authenticatedUserId not there!" });
  const renter = await getRenter(authenticatedUserId);
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

const getRenter = async (authenticatedUserId: string) => {
  try {
    return await prisma.renter.findFirst({
      where: { authenticatedUserId: authenticatedUserId },
      include: { rentalObject: true, rentalAgreement: true },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};
