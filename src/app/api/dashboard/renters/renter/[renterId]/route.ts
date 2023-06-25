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
