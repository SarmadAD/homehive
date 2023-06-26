import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function GET(request: Request, { params }: { params: { landlordId: string } }) {
  const { landlordId } = params;
  if (landlordId) {
    const landlords = await prisma.landlord.findUnique({
      where: { id: landlordId },
      include: { renters: true },
    });
    if (landlords && landlords.renters.length > 0) {
      return NextResponse.json(landlords.renters);
    }
    return NextResponse.json({ error: "error" });
  }
}
