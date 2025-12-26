import { Prisma, Renter } from "@prisma/client";
import { NextResponse } from "next/server";
import { RentalObject } from "prisma/types/objects";
import { prisma } from "src/app/db/db";

type Params = { objectId: string };

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  const { objectId } = await params;
  if (objectId) {
    const rentalObject = await prisma.rentalObject.findFirst({
      where: { id: objectId },
      include: {
        renter: { where: { state: 1 }, include: { rentalAgreement: true, rentPayment: true } },
        rentalAgreement: true,
        repairRequests: { include: { renter: true } },
      },
    });
    if (rentalObject) {
      return NextResponse.json(rentalObject);
    }
    return NextResponse.json({ error: "rentalObject not found" });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { objectId } = await params;
    if (objectId) {
      const deletedRentalObject = await prisma.rentalObject.update({
        where: { id: objectId },
        data: {
          state: 0,
        },
      });
      if (deletedRentalObject) {
        return NextResponse.json(deletedRentalObject);
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

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { objectId } = await params;
    const rentalObject: RentalObject = await request.json();
    if (objectId) {
      const rentersId: Prisma.RenterWhereUniqueInput[] = rentalObject.renter.map((renter: Renter) => ({
        id: renter.id,
      }));
      const updatedRentalObject = await prisma.rentalObject.update({
        where: { id: objectId },
        data: {
          name: rentalObject.name,
          createdAt: rentalObject.createdAt,
          image: "",
          address: rentalObject.address,
          houseNr: rentalObject.houseNr,
          additionalHouseDetails: rentalObject.additionalHouseDetails,
          city: rentalObject.city,
          postalCode: rentalObject.postalCode,
          renter: { connect: rentersId },
          areaSize: rentalObject.areaSize,
        },
        include: {
          renter: true,
        },
      });
      if (updatedRentalObject) {
        return NextResponse.json(updatedRentalObject);
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
