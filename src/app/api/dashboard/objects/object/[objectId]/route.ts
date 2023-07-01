import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { RentalObject } from "prisma/types/objects";
import { prisma } from "src/app/db/db";

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

export async function PUT(request: Request, { params }: { params: { objectId: string } }) {
  try {
    const { objectId } = params;
    const rentalObject: RentalObject = await request.json();
    if (objectId) {
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
          areaSize: rentalObject.areaSize,
          rentalObjectInfo: {
            update: {
              baseRent: rentalObject.rentalObjectInfo.baseRent,
              electricityCosts: rentalObject.rentalObjectInfo.electricityCosts,
              heatingCosts: rentalObject.rentalObjectInfo.heatingCosts,
              waterCosts: rentalObject.rentalObjectInfo.waterCosts,
              dueDateOfRent: rentalObject.rentalObjectInfo.dueDateOfRent,
            },
          },
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
