import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function GET(request: Request, { params }: { params: { renterId: string } }) {
  const { renterId } = params;
  if (renterId) {
    const renter = await prisma.renter.findFirst({
      where: { id: renterId },
    });
    if (renter) {
      return NextResponse.json(renter);
    }
    return NextResponse.json({ error: "renter not found" });
  }
}

export async function PUT(request: Request, { params }: { params: { renterId: string } }) {
  const { renterId } = params;
  const firebaseUserId: string = await request.text();
  if (renterId) {
    const renter = await prisma.renter.update({
      where: { id: renterId },
      data: {
        firebaseUserId: firebaseUserId,
      },
    });
    if (renter) {
      return NextResponse.json(renter);
    }
    return NextResponse.json({ error: "renter not found" });
  }
}
