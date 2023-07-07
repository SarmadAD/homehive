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
    await prisma.userRole.create({
      data: {
        firebaseUserId: firebaseUserId,
        role: { connect: { id: "20f9fbe2-0855-11ee-be56-0242ac120052" } },
      },
    });
    if (renter) {
      return NextResponse.json(renter);
    }
    return NextResponse.json({ error: "renter not found" });
  }
}
