import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { objectId: string } }) {
  const { objectId } = params;
  if (objectId) {
    const rentalObject = await prisma.rentalObject.findFirst({
      where: { id: objectId },
      include: { renter: true, rentalObjectInfo: true, repairRequests: { include: { renter: true } } },
    });
    if (rentalObject) {
      return NextResponse.json(rentalObject);
    }
    return NextResponse.json({ error: "rentalObject not found" });
  }
}
