import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const landlordId = request.nextUrl.searchParams.get("lloId");
  if (landlordId) {
    const rentalObjects = await prisma.rentalObject.findMany({
      where: { landlordId: landlordId },
      include: { renter: true, rentalObjectInfo: true, repairRequests: true },
    });
    if (rentalObjects.length > 0) {
      return NextResponse.json(rentalObjects);
    }
    return NextResponse.json({ error: "error" });
  }
}
