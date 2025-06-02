import { NextRequest, NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get("landlordId");
    if (!landlordId) {
      return NextResponse.json({ error: "Missing required parameter: landlordId" }, { status: 400 });
    }
    const rentalAgreements = await prisma.rentalAgreement.findMany({
      where: { landlordId },
      include: { renter: true, rentalObject: true },
    });
    return NextResponse.json(rentalAgreements, { status: 200 });
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);

    const { renter, rentalObjectId, dueDateState, baseRent, serviceCharges } = body;
    const landlordId = searchParams.get("landlordId");

    if (!landlordId || !renter.id || !rentalObjectId || !dueDateState) {
      return NextResponse.json({ error: "Missing required fields: landlordId, renterId, rentalObjectId, dueDateState" }, { status: 400 });
    }

    // Prisma-Transaction: Agreement anlegen & Renter aktualisieren
    const [rentalAgreement, updatedRenter] = await prisma.$transaction([
      prisma.rentalAgreement.create({
        data: {
          landlord: { connect: { id: landlordId } },
          renter: { connect: { id: renter.id } },
          rentalObject: { connect: { id: rentalObjectId } },
          dueDateState,
          baseRent,
          serviceCharges,
        },
        include: { renter: true, rentalObject: true, landlord: true },
      }),
      prisma.renter.update({
        where: { id: renter.id },
        data: { rentalObjectId: rentalObjectId },
      }),
    ]);

    return NextResponse.json(rentalAgreement, { status: 201 });
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
