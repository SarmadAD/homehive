import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { RentalObject } from "prisma/types/objects";
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

export async function POST(request: Request, { params }: { params: { landlordId: string } }) {
  try {
    const { landlordId } = params;
    const rentalObject: RentalObject = await request.json();
    if (landlordId) {
      const createdRentalObject = await prisma.rentalObject.create({
        data: {
          name: rentalObject.name,
          status: rentalObject.status,
          createdAt: rentalObject.createdAt,
          image: "",
          address: rentalObject.address,
          houseNr: rentalObject.houseNr,
          additionalHouseDetails: rentalObject.additionalHouseDetails,
          city: rentalObject.city,
          postalCode: rentalObject.postalCode,
          areaSize: rentalObject.areaSize,
          renter: {
            connect: {
              id: rentalObject.renter[0].id,
            },
          },
          rentalObjectInfo: {
            create: {
              baseRent: rentalObject.rentalObjectInfo.baseRent,
              electricityCosts: rentalObject.rentalObjectInfo.electricityCosts,
              heatingCosts: rentalObject.rentalObjectInfo.heatingCosts,
              waterCosts: rentalObject.rentalObjectInfo.waterCosts,
              dueDateOfRent: rentalObject.rentalObjectInfo.dueDateOfRent,
            },
          },
          landlord: {
            connect: {
              id: rentalObject.landlord.id,
            },
          },
        },
      });
      if (createdRentalObject) {
        return NextResponse.json(createdRentalObject);
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
