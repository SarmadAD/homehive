import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function GET(request: Request, { params }: { params: { landlordId: string } }) {
  const { landlordId } = params;
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
