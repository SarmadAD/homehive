import { Prisma, RentalAgreement } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

type Params = { rentalAgreementId: string };

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  const { rentalAgreementId } = await params;
  if (rentalAgreementId) {
    const rentalAgreement = await prisma.rentalAgreement.findFirst({
      where: { id: rentalAgreementId },
      include: { renter: true, rentalObject: true },
    });
    if (rentalAgreement) {
      return NextResponse.json(rentalAgreement);
    }
    return NextResponse.json({ error: "rentalAgreement not found" });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { rentalAgreementId } = await params;
    const rentalAgreement: RentalAgreement = await request.json();
    if (rentalAgreementId) {
      const updatedRentalAgreement = await prisma.rentalAgreement.update({
        where: { id: rentalAgreementId },
        data: {
          dueDateState: rentalAgreement.dueDateState,
          baseRent: rentalAgreement.baseRent,
          serviceCharges: rentalAgreement.serviceCharges,
        },
      });
      if (updatedRentalAgreement) {
        return NextResponse.json(updatedRentalAgreement);
      }
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientRustPanicError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ error: e.message });
    }
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { rentalAgreementId } = await params;
    if (rentalAgreementId) {
      const deletedRentalAgreement = await prisma.rentalAgreement.delete({
        where: { id: rentalAgreementId },
      });
      if (deletedRentalAgreement) {
        return NextResponse.json(deletedRentalAgreement);
      }
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientRustPanicError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ error: e.message });
    }
  }
}
